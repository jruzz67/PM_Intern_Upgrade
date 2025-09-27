from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection
import uuid
import logging
import re

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('company', __name__)

@bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    legal_entity = request.form.get('legal_entity')
    address = request.form.get('address')
    phone = request.form.get('phone')
    email = request.form.get('email')
    sector = request.form.get('sector')
    industry = request.form.get('industry')

    # Validate required fields
    if not all([name, legal_entity, address, phone, email, sector, industry]):
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate phone (10 digits, numeric)
    if not (phone.isdigit() and len(phone) == 10):
        return jsonify({'error': 'Phone number must be 10 digits'}), 400

    # Validate email (basic regex)
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email format'}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        # Check for duplicate name
        cursor.execute("SELECT id FROM companies WHERE name = %s", (name,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Company with this name already exists'}), 400

        company_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO companies (
                id, name, legal_entity, address, phone, email, sector, industry, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (company_id, name, legal_entity, address, phone, email, sector, industry, 'pending')
        )
        conn.commit()
        return jsonify({'id': company_id, 'message': 'Signup successful, awaiting admin approval'}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    logging.debug(f"Login attempt for company: {name}")

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    cursor.execute("SELECT id, status FROM companies WHERE name = %s", (name,))
    company = cursor.fetchone()
    conn.close()

    if not company:
        logging.debug("Company not found")
        return jsonify({'error': 'Company not found'}), 404
    if company['status'] != 'approved':
        logging.debug(f"Company not approved, status: {company['status']}")
        return jsonify({'error': 'Company not approved. Awaiting admin approval'}), 403

    logging.debug(f"Company found: {company['id']}")
    return jsonify({'id': company['id'], 'user_type': 'company'}), 200