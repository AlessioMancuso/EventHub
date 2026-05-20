import os
from backend.app import create_app

config = os.getenv('FLASK_CONFIG', 'dev')
app = create_app(config)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
