from flask import Flask, jsonify
from flask_cors import CORS
from app.routes import student, company, admin

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": ["Content-Type"]}})

# Custom error handler to ensure CORS headers on errors
@app.errorhandler(Exception)
def handle_error(error):
    response = jsonify({'error': str(error)})
    response.status_code = 500
    return response

app.register_blueprint(student.bp, url_prefix='/api/student')
app.register_blueprint(company.bp, url_prefix='/api/company')
app.register_blueprint(admin.bp, url_prefix='/api/admin')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)