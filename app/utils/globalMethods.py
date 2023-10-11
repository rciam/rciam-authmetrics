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
        # config
        authorize_file = 'authorize.' + g.tenant + '.' + g.environment + '.py'
        config_file = 'config.' + g.tenant + '.' + g.environment + '.py'
        oidc_config = configParser.getConfig('oidc_client', config_file)

        self.logger.debug("""Authorize Config File Name: {0}""".format(authorize_file))
        self.logger.debug("""Config File Name: {0}""".format(config_file))

        self.oauth.register(
            'rciam',
            client_id=oidc_config['client_id'],
            client_secret=oidc_config['client_secret'],
            server_metadata_url=oidc_config['issuer'] + "/.well-known/openid-configuration",
            client_kwargs={'scope': 'openid profile email voperson_id eduperson_entitlement'}
        )

        response.headers["Access-Control-Expose-Headers"] = "X-Permissions, X-Authenticated, X-Redirect"

        # permissions calculation
        access_token = request.headers.get('x-access-token')
        rciam = self.oauth.create_client('rciam')
        metadata = await rciam.load_server_metadata()

        headers = {'Authorization': f'Bearer {access_token}'}
        resp = reqs.get(metadata['userinfo_endpoint'], headers=headers)

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
                self.logger.error("""error: {0}""" . format(str(er)))
                raise HTTPException(status_code=500)

        # Authorization
        permissions = permissionsCalculation(self.logger, authorize_file, data)
        self.logger.debug("""permissions: {0}""" . format(permissions))
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

    logger.debug("""Entitlements Config: {0}""" . format(str(entitlements_config)))
    logger.debug("""User Entitlements Config: {0}""" . format(str(user_entitlements)))

    for ent, role in entitlements_config.items():
        if user_entitlements is not None and ent in user_entitlements:
            # Reset the default anonymous role
            roles['anonymous'] = False
            # The role might be a csv list. So we need to
            # explode and act accordingly
            for item_role in role.split(","):
                roles[item_role] = True

    logger.debug("""roles: {0}""" . format(str(roles)))

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
