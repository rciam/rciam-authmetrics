import logging
import sys
from app.utils import configParser
from logging.handlers import TimedRotatingFileHandler

FORMATTER = logging.Formatter("""%(asctime)s - %(name)s - %(levelname)s - %(message)s""")
LOG_FILE = "{0}/{1}".format(configParser.getConfig('logging', 'config.global.py')['folder'],
                            configParser.getConfig('logging', 'config.global.py')['file'])
LEVEL = configParser.getConfig('logging', 'config.global.py')['level']


def get_console_handler():
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(FORMATTER)
    return console_handler


def get_file_handler():
    file_handler = TimedRotatingFileHandler(LOG_FILE, when='midnight')
    file_handler.setFormatter(FORMATTER)
    return file_handler


def get_logger(logger_name):
    logger = logging.getLogger(logger_name)	
    logger.setLevel(LEVEL)	
    logger.addHandler(get_console_handler())	
    logger.addHandler(get_file_handler())
    # with this pattern, it's rarely necessary
    # to propagate the error up to parent
    logger.propagate = False
    return logger
