from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection

bp = Blueprint('admin', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM admins WHERE name = %s", (name,))
    admin = cursor.fetchone()
    conn.close()
    
    if admin:
        return jsonify({'id': admin['id'], 'user_type': 'admin'}), 200
    return jsonify({'error': 'Admin not found'}), 404

@bp.route('/companies', methods=['GET'])
def list_companies():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, status FROM companies")
    companies = cursor.fetchall()
    conn.close()
    
    return jsonify([
        {'id': row['id'], 'name': row['name'], 'status': row['status']}
        for row in companies
    ]), 200

@bp.route('/internships', methods=['GET'])
def list_internships():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, company_id, role, sector, description, 
               locations, must_required_skills, appreciated_certifications, 
               plugin, registration_end, status 
        FROM internships
        """
    )
    internships = cursor.fetchall()
    conn.close()
    
    return jsonify([
        {
            'id': row['id'],
            'company_id': row['company_id'],
            'role': row['role'],
            'sector': row['sector'],
            'description': row['description'],
            'locations': row['locations'] if row['locations'] else [],
            'must_required_skills': row['must_required_skills'] if row['must_required_skills'] else [],
            'appreciated_certifications': row['appreciated_certifications'] if row['appreciated_certifications'] else [],
            'plugin': row['plugin'] if row['plugin'] else {},
            'registration_end': row['registration_end'].isoformat() if row['registration_end'] else None,
            'status': row['status']
        }
        for row in internships
    ]), 200

@bp.route('/approve-company', methods=['POST'])
def approve_company():
    data = request.get_json()
    company_id = data.get('company_id')
    status = data.get('status')
    
    if not company_id or status not in ['approved', 'rejected']:
        return jsonify({'error': 'Invalid company_id or status'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE companies SET status = %s WHERE id = %s",
            (status, company_id)
        )
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Company not found'}), 404
        conn.commit()
        return jsonify({'message': f'Company {status}'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/approve-internship', methods=['POST'])
def approve_internship():
    data = request.get_json()
    internship_id = data.get('internship_id')
    status = data.get('status')
    
    if not internship_id or status not in ['approved', 'rejected']:
        return jsonify({'error': 'Invalid internship_id or status'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE internships SET status = %s WHERE id = %s",
            (status, internship_id)
        )
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Internship not found'}), 404
        conn.commit()
        return jsonify({'message': f'Internship {status}'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()