from flask import Flask, jsonify, make_response
from flask_cors import CORS
from app.routes import student, company, admin, internship
import logging
import traceback

app = Flask(__name__)
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Admin-ID"]
}})

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Handle all OPTIONS requests for /api/*
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_options(path):
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Admin-ID'
    logging.debug(f"Handled OPTIONS request for /api/{path}")
    return response, 200

# Custom error handler to ensure CORS headers on errors
@app.errorhandler(Exception)
def handle_error(error):
    logging.error(f"Unhandled error: {str(error)}\n{traceback.format_exc()}")
    response = jsonify({'error': str(error)})
    response.status_code = 500
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Admin-ID')
    return response

app.register_blueprint(student.bp, url_prefix='/api/student')
app.register_blueprint(company.bp, url_prefix='/api/company')
app.register_blueprint(admin.bp, url_prefix='/api/admin')
app.register_blueprint(internship.bp, url_prefix='/api/internship')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)