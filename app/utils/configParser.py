import os, sys
import pwd
from configparser import RawConfigParser

CONFIG_FILE = 'config.py'

def getConfig(section='source_database'):

  # create a parser
  parser = RawConfigParser()
  print(sys.argv[0])
  print(os.path.dirname(os.path.abspath(sys.argv[0])))
  # read config file
  file_dir = os.path.dirname(os.path.realpath('__file__'))
  parser.read(os.path.join(file_dir, CONFIG_FILE))

  # get section, default to source_database
  config = {}

  if parser.has_section(section):

    params = parser.items(section)
    for param in params:
      config[param[0]] = param[1]

  else:
    raise Exception(
      'Section {0} not found in the {1} file'.format(section, CONFIG_FILE))

  return config
