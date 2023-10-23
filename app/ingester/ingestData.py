from .communityIngester import CommunityDataIngester
from .usersIngester import UserDataIngester
from .membeshipIngester import MembershipDataIngester
from .loginsIngester import LoginDataIngester
from ..database import db

session = db.create_session()
# Ingest Communities
CommunityDataIngester.ingestCommunityData(session)
# Ingest Users
UserDataIngester.ingestUserData(session)
# Ingest Memberships
MembershipDataIngester.ingestMembershipData(session)
# Ingest Logins
LoginDataIngester.ingestLoginData(session)
session.close()
