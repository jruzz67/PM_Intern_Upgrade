from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection
import logging

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('admin', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    logging.debug(f"Login attempt for admin: {name}")

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    cursor.execute("SELECT id FROM admins WHERE name = %s", (name,))
    admin = cursor.fetchone()
    conn.close()

    if not admin:
        logging.debug("Admin not found")
        return jsonify({'error': 'Admin not found'}), 404

    logging.debug(f"Admin found: {admin['id']}")
    return jsonify({'id': admin['id'], 'user_type': 'admin'}), 200

@bp.route('/companies/pending', methods=['GET'])
def get_pending_companies():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, name, legal_entity, address, phone, email, sector, industry
            FROM companies WHERE status = 'pending'
            """
        )
        companies = cursor.fetchall()
        conn.close()
        return jsonify([
            {
                'id': row['id'],
                'name': row['name'],
                'legal_entity': row['legal_entity'],
                'address': row['address'],
                'phone': row['phone'],
                'email': row['email'],
                'sector': row['sector'],
                'industry': row['industry']
            } for row in companies
        ]), 200
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@bp.route('/companies/approved', methods=['GET'])
def get_approved_companies():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT 
                c.id, c.name, 
                COUNT(i.id) as total_internships,
                COALESCE(SUM(i.intake), 0) as total_intake
            FROM companies c
            LEFT JOIN internships i ON c.id = i.company_id
            WHERE c.status = 'approved'
            GROUP BY c.id, c.name
            """
        )
        companies = cursor.fetchall()
        conn.close()
        return jsonify([
            {
                'id': row['id'],
                'name': row['name'],
                'total_internships': row['total_internships'],
                'total_intake': row['total_intake']
            } for row in companies
        ]), 200
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

@bp.route('/company/approve/<company_id>', methods=['POST'])
def approve_company(company_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE companies SET status = 'approved' WHERE id = %s RETURNING id",
            (company_id,)
        )
        company = cursor.fetchone()
        if not company:
            conn.close()
            return jsonify({'error': 'Company not found'}), 404
        conn.commit()
        conn.close()
        return jsonify({'message': 'Company approved'}), 200
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500

@bp.route('/company/deny/<company_id>', methods=['POST'])
def deny_company(company_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE companies SET status = 'denied' WHERE id = %s RETURNING id",
            (company_id,)
        )
        company = cursor.fetchone()
        if not company:
            conn.close()
            return jsonify({'error': 'Company not found'}), 404
        conn.commit()
        conn.close()
        return jsonify({'message': 'Company denied'}), 200
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 500

@bp.route('/companies/history', methods=['GET'])
def get_company_history():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT 
                c.id, c.name, c.status, 
                COUNT(i.id) as total_internships,
                COALESCE(SUM(i.intake), 0) as total_intake
            FROM companies c
            LEFT JOIN internships i ON c.id = i.company_id
            GROUP BY c.id, c.name, c.status
            """
        )
        companies = cursor.fetchall()
        conn.close()
        return jsonify([
            {
                'id': row['id'],
                'name': row['name'],
                'status': row['status'],
                'total_internships': row['total_internships'],
                'total_intake': row['total_intake']
            } for row in companies
        ]), 200
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500