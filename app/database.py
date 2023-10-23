from app.utils import configParser
from sqlalchemy import create_engine
from sqlmodel import Session
from sqlalchemy.exc import OperationalError


class Database:
    def __init__(self):

        config_file = 'config.global.py'
        db_params = configParser.getConfig('database_parameters', config_file)

        url = db_params['database_url']
        pool_size = int(db_params.get('pool_size', 25))
        max_overflow = int(db_params.get('max_overflow', 5))

        self.engine = create_engine(url, pool_size=pool_size, max_overflow=max_overflow)

    def check_database_connection(self):
        try: 
          # Attempt to connect to the database by checking the connection
            with self.engine.connect():
                print("Database connection successful!")
                return True
        except OperationalError as e:
            print(f"Database connection failed: {e}")
            return False 
        
    def get_session(self):
        with Session(self.engine) as session:
            yield session

    def create_session(self):
        return Session(self.engine)


# Creating an instance of Database
db = Database()
