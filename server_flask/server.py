#
# main program
#
import sys
from mongoengine import connect
from config import Config
from appPck import create_app

# get parameter from command line
host = sys.argv[1] or 'localhost'
port = int(sys.argv[2]) or 5000

# init mongodb connection
db_client = connect( host=Config.MONGODB_HOST, port=Config.MONGODB_PORT )

# create app instance
app = create_app()

if __name__ == "__main__":
    app.run(host=host, port=port)
