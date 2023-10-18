from app.logger import log
import requests as reqs
from fastapi import Depends, FastAPI, HTTPException, Query, Request, HTTPException, status, Response
import json, jwt

from app.utils import configParser
from authlib.integrations.starlette_client import OAuth, OAuthError
from app.utils.fastapiGlobals import g


# https://www.fastapitutorial.com/blog/class-based-dependency-injection/
class AuthNZCheck:
    logger = log.get_logger("AuthNZCheck")

    def __init__(self, tag: str = "", skip: bool = False):
        self.skip = skip
        self.tag = tag
        self.oauth = OAuth()

    async def __call__(self, request: Request, response: Response):
        self.logger.debug("""=============== Request Context =================""")
        self.logger.debug("""{0}.{1}: Request Url: {2}""" . format(g.tenant, g.environment, request.url))
        self.logger.debug("""{0}.{1}: Request Headers: {2}""" . format(g.tenant, g.environment, request.headers))

        # config
        authorize_file = 'authorize.' + g.tenant + '.' + g.environment + '.py'
        config_file = 'config.' + g.tenant + '.' + g.environment + '.py'
        oidc_config = configParser.getConfig('oidc_client', config_file)

        self.logger.debug("""{0}.{1}: Authorize Config File Name: {2}""".format(g.tenant, g.environment, authorize_file))
        self.logger.debug("""{0}.{1}: Config File Name: {2}""".format(g.tenant, g.environment, config_file))

        self.oauth.register(
            g.tenant + '.' + g.environment + '.rciam',
            client_id=oidc_config['client_id'],
            client_secret=oidc_config['client_secret'],
            server_metadata_url=oidc_config['issuer'] + "/.well-known/openid-configuration",
            client_kwargs={'scope': 'openid profile email voperson_id eduperson_entitlement'}
        )

        response.headers["Access-Control-Expose-Headers"] = "X-Permissions, X-Authenticated, X-Redirect"

        # permissions calculation
        access_token = request.headers.get('x-access-token')
        rciam = self.oauth.create_client(g.tenant + '.' + g.environment + '.rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}

        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)
        self.logger.debug("""{0}.{1}: User Info Endpoint Response: {2}""" . format(g.tenant, g.environment, resp))

        # Authentication
        if resp.status_code == 401:
            # For now we skip logins and dashboard routes
            if (self.tag == 'logins' or self.tag == 'dashboard') and self.skip:
                permissions = permissionsCalculation(self.logger, authorize_file)
                permissions_json = json.dumps(permissions).replace(" ", "").replace("\n", "")
                # pprint(permissions_json)
                response.headers["X-Permissions"] = permissions_json
                response.headers["X-Authenticated"] = "false"
                response.headers["X-Redirect"] = "false"
                return

            self.logger.debug("""{0}.{1}: Unauthorized request to User Info endpoint""")
            self.logger.debug("""{0}.{1}: Response headers: {2}""" . format(g.tenant, g.environment, resp.headers))
            self.logger.debug("""{0}.{1}: Response body: {2}""" . format(g.tenant, g.environment, resp.json()))
            raise HTTPException(
                status_code=401,
                detail="Authentication failed",
                headers={
                    "X-Authenticated": "false",
                    "X-Redirect": "true",
                    "Access-Control-Expose-Headers": "X-Permissions, X-Authenticated, X-Redirect"
                }
            )
        else:
            try:
                resp.raise_for_status()
                data = resp.json()
            except Exception as er:
                # TODO: Log here
                self.logger.error("""{0}.{1}: error: {2}""".format(g.tenant, g.environment, er))
                raise HTTPException(status_code=500)

        self.logger.debug("""{0}.{1}: User Info Response: {2}""" . format(g.tenant, g.environment, data))
        # Authorization
        permissions = permissionsCalculation(self.logger, authorize_file, data)
        self.logger.debug("""{0}.{1}:  permissions: {2}""".format(g.tenant, g.environment, permissions))
        permissions_json = json.dumps(permissions).replace(" ", "").replace("\n", "")

        # Add the permission to a custom header field
        response.headers["X-Permissions"] = permissions_json
        response.headers["X-Authenticated"] = "true"

        if bool(self.tag):
            # Currently we only care about view
            if permissions['actions'][self.tag]['view'] == False:
                HTTPException(status_code=403)


def permissionsCalculation(logger, authorize_file, user_info=None):
    entitlements_config = configParser.getConfig('entitlements', authorize_file)
    user_entitlements = {}
    if user_info is not None:
        user_entitlements = user_info.get('eduperson_entitlement')

    roles = {
        'anonymous': True,
        'authenticated': False,
        'administrator': False
    }

    logger.debug("""{0}.{1}: Entitlements Config: {2}""".format(g.tenant, g.environment, entitlements_config))
    logger.debug("""{0}.{1}: User Entitlements Config: {2}""".format(g.tenant, g.environment, user_entitlements))

    for ent, role in entitlements_config.items():
        if user_entitlements is not None and ent in user_entitlements:
            # Reset the default anonymous role
            roles['anonymous'] = False
            # The role might be a csv list. So we need to
            # explode and act accordingly
            for item_role in role.split(","):
                roles[item_role] = True

    logger.debug("""{0}.{1}: roles: {2}""".format(g.tenant, g.environment, roles))

    actions = {
        'dashboard': {
            'view': False,
            'write': False
        },
        'identity_providers': {
            'view': False,
            'write': False
        },
        'service_providers': {
            'view': False,
            'write': False
        },
        'logins': {
            'view': True,
            'write': True
        },
        'registered_users': {
            'view': False,
            'write': False
        },
        'communities': {
            'view': False,
            'write': False
        },
        'statistics_raw': {
            'views': False,
            'write': False,
        }
    }

    for role in roles.keys():
        if roles[role]:
            role_actions = configParser.getConfig(role, authorize_file)
            for view, config_actions in role_actions.items():
                for item in config_actions.split(","):
                    actions[view][item] = True
    return {
        'roles': roles,
        'actions': actions
    }


def hasAction(user_actions, category, action):
    if (user_actions[category][action] is True):
        return True
    return False
