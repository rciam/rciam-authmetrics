from configparser import RawConfigParser

CONFIG_FILE = 'config.py'

def getConfig(section='source_database'):

      # create a parser

      parser = RawConfigParser()

      # read config file

      parser.read(CONFIG_FILE)

      # get section, default to source_database

      config = {}

      if parser.has_section(section):

          params = parser.items(section)

          for param in params:

              config[param[0]] = param[1]

      else:

          raise Exception('Section {0} not found in the {1} file'.format(section, CONFIG_FILE))

      
      return config
