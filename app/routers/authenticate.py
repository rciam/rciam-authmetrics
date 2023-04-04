from fastapi import APIRouter, Depends, HTTPException, status, Security, Request

from app.utils import configParser
from starlette.config import Config
from starlette.responses import HTMLResponse, RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from authlib.common.urls import urlparse

router = APIRouter(
    tags=["authenticate"],
    # dependencies=[Depends(get_token_header)],
    # responses={404: {"description": "Not found"}},
)

OIDC_config = configParser.getConfig('oidc_client')
config = Config('.env')
oauth = OAuth(config)

oauth.register(
    'rciam',
    client_id=OIDC_config['client_id'],
    client_secret=OIDC_config['client_secret'],
    server_metadata_url=OIDC_config['openid_connect_url'],
    client_kwargs={'scope': 'openid profile email eduperson_entitlement'}
)

@router.get('/login', include_in_schema=False)
async def login_endpoint(request: Request):
    rciam = oauth.create_client('rciam')
    redirect_uri = request.url_for('authorize_rciam')
    return await rciam.authorize_redirect(request, redirect_uri)

@router.get('/auth', include_in_schema=False)
async def authorize_rciam(request: Request):
    rciam = oauth.create_client('rciam')
    try:
        token = await rciam.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f'<h1>{error.error}</h1>')
    user = token.get('userinfo')
    if user:
        request.session['user'] = dict(user)
    # Fetch the userinfo data
    if user.get("email") is None:
        metadata = await rciam.load_server_metadata()
        if not metadata['userinfo_endpoint']:
            raise RuntimeError('Missing "userinfo_endpoint" value')
        # Make a request to the userinfo endpoint
        user_info = await rciam.get(metadata['userinfo_endpoint'], token=token)
        user_info.raise_for_status()
        data = user_info.json()
        print(data)

    return RedirectResponse(url='/')

@router.get('/logout', include_in_schema=False)
async def logout(request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')