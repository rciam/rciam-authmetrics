from configparser import RawConfigParser
import sys
import psycopg2
# import the error handling libraries for psycopg2
from psycopg2 import OperationalError, errorcodes, errors
from Logger import log

def singleton(theClass):
    """ decorator for a class to make a singleton out of it """
    classInstances = {}

    def getInstance(*args, **kwargs):
        """ creating or just return the one and only class instance.
            The singleton depends on the parameters used in __init__ """
        key = (theClass, args, str(kwargs))
        if key not in classInstances:
            classInstances[key] = theClass(*args, **kwargs)
        return classInstances[key]

    return getInstance

class pgConnector:
  logger = log.get_logger("pgConnector")
  conn = None

  def __init__(self, filename = "config.py", section = "source_database"):

    self.filename = filename
    self.section = section
    self.params = self.config(filename, section)
    if self.conn == None:
      try:
        self.logger.debug('Connecting to the PostgreSQL database...')
        self.conn = psycopg2.connect(**self.params)
        self.set_utc_timezone()
      except psycopg2.OperationalError as err:
        self.logger.error(str(err).strip())
        sys.exit(1)

  def config(self, filename='config.py', section='source_database'):

    # create a parser
    parser = RawConfigParser()

    # read config file
    parser.read(filename)

    # get section, default to source_database
    db = {}

    if parser.has_section(section):
      params = parser.items(section)
      for param in params:
        db[param[0]] = param[1]
    else:
      self.logger.error('Section {0} not found in the {1} file'.format(section, filename))
      raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db

  def execute_select(self, query):

    # create a cursor
    cur = self.conn.cursor()

    # execute a statement
    cur.execute(query)

    return cur.fetchall()

  def execute_and_commit_with_fetch(self, query):
    
    try:
      cur = self.conn.cursor()
      cur.execute(query)
      self.conn.commit()
      id = cur.fetchone()
      if (id is not None):
        self.logger.info("{0}".format(id[0]))
        return id[0]
      else :
        return None
    except Exception as err:
      self.logger.error(str(err).strip())
      sys.exit(1)  

  def execute_and_commit(self, query, data=None):
    
    try:
      cur = self.conn.cursor()
      if (data is None):
        cur.execute(query)
      else:
        self.logger.info(str(data))
        cur.execute(query, data)
      self.conn.commit()
    except Exception as err:
      self.logger.error(str(err).strip())
      sys.exit(1)  

  def close(self):

    self.conn.close()
    self.logger.debug('Database connection closed.')

  def set_utc_timezone(self):
    try:
        self.logger.debug('Setting timezone to UTC...')
        with self.conn.cursor() as cur:
            cur.execute("SET timezone TO 'UTC'")
            self.conn.commit()
        self.logger.debug('Timezone set to UTC.')
    except Exception as err:
        self.logger.error('Error setting timezone to UTC: {}'.format(str(err).strip()))
        sys.exit(1)

# Subclass of pgConnector
@singleton
class sourcePgConnector(pgConnector):
   def __init__(self, filename = "config.py", section = "source_database"):
     super().__init__(filename, section)

# Subclass of pgConnector
@singleton
class sourcePgConnectorProxy(pgConnector):
   def __init__(self, filename = "config.py", section = "source_database_proxy"):
     super().__init__(filename, section)

# Subclass of pgConnector
@singleton
class destinationPgConnector(pgConnector):
   def __init__(self, filename = "config.py", section = "destination_database"):
     super().__init__(filename, section)