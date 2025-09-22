from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection
import uuid
import json

bp = Blueprint('company', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    
    if not name:
        return jsonify({'error': 'Missing company name'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        company_id = str(uuid.uuid4())
        cursor.execute(
            "INSERT INTO companies (id, name, status) VALUES (%s, %s, 'pending') RETURNING id",
            (company_id, name)
        )
        conn.commit()
        return jsonify({'id': company_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT id, status FROM companies WHERE name = %s", (name,))
    company = cursor.fetchone()
    conn.close()
    
    if company:
        return jsonify({'id': company['id'], 'status': company['status'], 'user_type': 'company'}), 200
    return jsonify({'error': 'Company not found'}), 404

@bp.route('/post', methods=['POST'])
def post_internship():
    data = request.get_json()
    company_id = data.get('company_id')
    role = data.get('role')
    sector = data.get('sector')
    description = data.get('description')
    locations = data.get('locations')
    must_required_skills = data.get('must_required_skills')
    appreciated_certifications = data.get('appreciated_certifications')
    plugin = data.get('plugin')
    registration_end = data.get('registration_end')
    
    if not all([company_id, role, sector, description, locations, must_required_skills, registration_end]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM companies WHERE id = %s", (company_id,))
    company = cursor.fetchone()
    
    if not company:
        conn.close()
        return jsonify({'error': 'Invalid company'}), 404
    if company['status'] != 'approved':
        conn.close()
        return jsonify({'error': 'Company not approved'}), 403
    
    try:
        internship_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO internships (
                id, company_id, role, sector, description, locations, 
                must_required_skills, appreciated_certifications, plugin, 
                registration_end, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'pending')
            RETURNING id
            """,
            (
                internship_id, company_id, role, sector, description,
                json.dumps(locations), json.dumps(must_required_skills),
                json.dumps(appreciated_certifications), json.dumps(plugin),
                registration_end
            )
        )
        conn.commit()
        return jsonify({'id': internship_id}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/internships', methods=['GET'])
def list_internships():
    company_id = request.args.get('company_id')
    
    if not company_id:
        return jsonify({'error': 'Missing company_id'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, company_id, role, sector, description, 
                   locations, must_required_skills, appreciated_certifications, 
                   plugin, registration_end, status 
            FROM internships 
            WHERE company_id = %s
            """,
            (company_id,)
        )
        internships = cursor.fetchall()
        result = [
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
        ]
        conn.close()
        return jsonify(result), 200
    except Exception as e:
        conn.close()
        return jsonify({'error': f'Failed to fetch internships: {str(e)}'}), 500