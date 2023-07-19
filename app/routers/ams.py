from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Field, Session, SQLModel, create_engine, select
from typing import Union
from app.utils import configParser, globalMethods
from app.database import get_session
from app.utils.globalMethods import AuthNZCheck


# from ..dependencies import get_token_header

router = APIRouter(
    tags=["ams"]
)


@router.get("/ams_stats/ams_verification_hash")
async def get_verification():

    verification_hash = configParser.getConfig('ams', 'config.global.py')['verification_hash']
    return verification_hash
