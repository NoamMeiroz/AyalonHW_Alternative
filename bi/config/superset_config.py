#---------------------------------------------------------
# Superset specific config
#---------------------------------------------------------
ROW_LIMIT = 5000

#SUPERSET_WEBSERVER_PORT = 8088
SUPERSET_WEBSERVER_PORT = 8000

#---------------------------------------------------------

#---------------------------------------------------------
# Flask App Builder configuration
#---------------------------------------------------------
# Your App secret key
SECRET_KEY = '\2\5fkfkfkfksan1dovcpff\4\6\r\y\y\h'

# The SQLAlchemy connection string to your database backend
# This connection defines the path to the database that stores your
# superset metadata (slices, connections, tables, dashboards, ...).
# Note that the connection information to connect to the datasources
# you want to explore are managed directly in the web UI
#SQLALCHEMY_DATABASE_URI = 'mysql://root:nativeRoot_28@mysql:3306/superset'
SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:nativeRoot_28@mysql:3306/superset'
#SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://ayalon_bi:jjwRi2df4@localhost:3306/superset'
SQLALCHEMY_POOL_SIZE = 5
SQLALCHEMY_POOL_TIMEOUT = 600
SQLALCHEMY_MAX_OVERFLOW = 10
SQLALCHEMY_POOL_RECYCLE = 1

#ENABLE_PROXY_FIX = True

SESSION_COOKIE_SAMESITE = None
SESSION_COOKIE_SECURE = False 
SESSION_COOKIE_HTTPONLY = False

# Flask-WTF flag for CSRF
WTF_CSRF_ENABLED = True
# Add endpoints that need to be exempt from CSRF protection
WTF_CSRF_EXEMPT_LIST = []
# A CSRF token that expires in 1 year
WTF_CSRF_TIME_LIMIT = 60 * 60 * 24 * 365

# Set this API key to enable Mapbox visualizations
MAPBOX_API_KEY = ''

class ReverseProxied(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        script_name = environ.get('HTTP_X_SCRIPT_NAME', '')
        if script_name:
            environ['SCRIPT_NAME'] = script_name
            path_info = environ['PATH_INFO']
            if path_info.startswith(script_name):
                environ['PATH_INFO'] = path_info[len(script_name):]

        scheme = environ.get('HTTP_X_SCHEME', '')
        if scheme:
            environ['wsgi.url_scheme'] = scheme
        return self.app(environ, start_response)


#ADDITIONAL_MIDDLEWARE = [ReverseProxied, ]