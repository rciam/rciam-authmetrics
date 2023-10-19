from app.utils import configParser
from sqlmodel import create_engine, Session


def get_session():
    # Initialize
    config_file = 'config.global.py'
    db_params = configParser.getConfig('database_parameters', config_file)

    url = db_params['database_url']
    pool_size = int(db_params.get('pool_size', 25))
    max_overflow = int(db_params.get('max_overflow', 5))
    engine = create_engine(url, pool_size=pool_size, max_overflow=max_overflow)

    with Session(engine) as session:
        yield session
