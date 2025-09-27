from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection
from app.services.scoring_engine import calculate_affirmative_action_score
import uuid
import json
import logging
import os
from werkzeug.utils import secure_filename
import numpy as np

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('student', __name__)

@bp.route('/register', methods=['POST'])
def register():
    name = request.form.get('name')
    age = request.form.get('age')
    cgpa = request.form.get('cgpa')
    community_category = request.form.get('community_category')
    gender = request.form.get('gender')
    urban_rural = request.form.get('urban_rural')
    family_income = request.form.get('family_income')
    education_level = request.form.get('education_level')
    
    # Validate required fields
    if not all([name, age, cgpa, community_category, gender, urban_rural, family_income, education_level]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate data types and PMIS eligibility
    try:
        age = int(age)
        cgpa = float(cgpa)
        family_income = float(family_income)
        
        # PMIS Eligibility Checks
        if age < 21 or age > 24:
            return jsonify({'error': 'Age must be between 21 and 24'}), 400
        if cgpa < 0 or cgpa > 10:
            return jsonify({'error': 'Invalid CGPA'}), 400
        if family_income > 800000:
            return jsonify({'error': 'Family income exceeds ₹8,00,000'}), 400
        if education_level not in ['High School', 'Higher Secondary', 'Diploma', 'Bachelor']:
            return jsonify({'error': 'Invalid education level'}), 400
        if community_category not in ['SC', 'ST', 'OBC', 'General', 'Others']:
            return jsonify({'error': 'Invalid community category'}), 400
        if gender not in ['Male', 'Female', 'Third Gender']:
            return jsonify({'error': 'Invalid gender'}), 400
        if urban_rural not in ['Urban', 'Rural']:
            return jsonify({'error': 'Invalid urban/rural status'}), 400
    except ValueError:
        return jsonify({'error': 'Invalid age, CGPA, or family income format'}), 400
    
    # Calculate affirmative action score
    student_data = {
        'community_category': community_category,
        'gender': gender,
        'urban_rural': urban_rural
    }
    affirmative_action_score = calculate_affirmative_action_score(student_data)
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        # Check for duplicate name
        cursor.execute("SELECT id FROM students WHERE name = %s", (name,))
        if cursor.fetchone():
            conn.close()
            return jsonify({'error': 'Student with this name already exists'}), 400
        
        student_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO students (
                id, name, age, cgpa, community_category, gender, urban_rural,
                family_income, education_level, affirmative_action_score
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (
                student_id, name, age, cgpa, community_category, gender, urban_rural,
                family_income, education_level, affirmative_action_score
            )
        )
        conn.commit()
        return jsonify({'id': student_id, 'affirmative_action_score': affirmative_action_score}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    name = data.get('name')
    logging.debug(f"Login attempt for student: {name}")
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM students WHERE name = %s", (name,))
    student = cursor.fetchone()
    conn.close()
    
    if student:
        logging.debug(f"Student found: {student['id']}")
        return jsonify({'id': student['id'], 'user_type': 'student'}), 200
    logging.debug("Student not found")
    return jsonify({'error': 'Student not found'}), 404

@bp.route('/internships', methods=['GET'])
def list_internships():
    domain = request.args.get('domain', '')
    search = request.args.get('search', '')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    try:
        query = """
            SELECT i.id, i.company_id, i.role, i.sector, i.description, 
                   i.locations, i.must_required_skills, i.appreciated_certifications, 
                   i.plugin, i.registration_end, i.status,
                   c.name AS company_name
            FROM internships i
            JOIN companies c ON i.company_id = c.id
            WHERE i.status = 'approved'
        """
        params = []
        
        if domain:
            query += " AND i.sector ILIKE %s"
            params.append(f'%{domain}%')
        if search:
            query += " AND i.role ILIKE %s"
            params.append(f'%{search}%')
        
        cursor.execute(query, params)
        internships = cursor.fetchall()
        conn.close()
        
        return jsonify([
            {
                'id': row['id'],
                'company_id': row['company_id'],
                'company_name': row['company_name'],
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
    except Exception as e:
        conn.close()
        return jsonify({'error': f'Failed to fetch internships: {str(e)}'}), 500

@bp.route('/apply', methods=['POST'])
def apply_internship():
    student_id = request.form.get('student_id')
    internship_id = request.form.get('internship_id')
    github_url = request.form.get('github_url')
    resume = request.files.get('resume')
    certs = request.form.get('certificates', '[]')
    
    if not all([student_id, internship_id, resume]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500
    
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM internships WHERE id = %s", (internship_id,))
    internship = cursor.fetchone()
    
    if not internship:
        conn.close()
        return jsonify({'error': 'Invalid internship'}), 404
    if internship['status'] != 'approved':
        conn.close()
        return jsonify({'error': 'Internship not approved'}), 403
    
    cursor.execute("SELECT id, name, age, cgpa, community_category, gender, urban_rural, family_income, education_level, affirmative_action_score FROM students WHERE id = %s", (student_id,))
    student = cursor.fetchone()
    if not student:
        conn.close()
        return jsonify({'error': 'Invalid student'}), 404
    
    cursor.execute(
        """
        SELECT id, role, sector, description, locations, must_required_skills, 
               appreciated_certifications, plugin
        FROM internships WHERE id = %s
        """,
        (internship_id,)
    )
    internship_data = cursor.fetchone()
    
    # Create uploads directory if it doesn't exist
    uploads_dir = 'uploads'
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir)
    
    # Sanitize resume filename
    safe_filename = secure_filename(resume.filename)
    resume_path = os.path.join(uploads_dir, f"{student_id}_{safe_filename}")
    
    try:
        resume.save(resume_path)
    except Exception as e:
        conn.close()
        return jsonify({'error': f'Failed to save resume: {str(e)}'}), 500
    
    try:
        certificates = json.loads(certs)
        if not isinstance(certificates, list):
            raise ValueError("Certificates must be a list")
        
        # Prepare student_data and internship_data
        student_data = {
            'name': student['name'],
            'age': student['age'],
            'cgpa': student['cgpa'],
            'community_category': student['community_category'],
            'gender': student['gender'],
            'urban_rural': student['urban_rural'],
            'family_income': student['family_income'],
            'education_level': student['education_level'],
            'affirmative_action': student['affirmative_action_score'],
            'github_url': github_url,
            'certificates': certificates
        }
        internship_data = {
            'role': internship_data['role'],
            'sector': internship_data['sector'],
            'description': internship_data['description'],
            'locations': internship_data['locations'] if internship_data['locations'] else [],
            'must_required_skills': internship_data['must_required_skills'] if internship_data['must_required_skills'] else [],
            'appreciated_certifications': internship_data['appreciated_certifications'] if internship_data['appreciated_certifications'] else [],
            'plugin': internship_data['plugin'] if internship_data['plugin'] else {}
        }
        
        # Mock vectors (replace with actual vector generation if available)
        student_vector = np.array([0.1] * 384)  # Mock 384-dim vector
        internship_vector = np.array([0.2] * 384)  # Mock 384-dim vector
        
        score = calculate_score(student_data, internship_data, student_vector, internship_vector)
        
        applicant_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO applicants (id, student_id, internship_id, resume_path, github_url, score)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (applicant_id, student_id, internship_id, resume_path, github_url, json.dumps(score))
        )
        
        for cert in certificates:
            cert_id = str(uuid.uuid4())
            cursor.execute(
                """
                INSERT INTO student_uploaded_certs (id, student_id, internship_id, provider, title)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (cert_id, student_id, internship_id, cert.get('provider'), cert.get('title'))
            )
        
        conn.commit()
        return jsonify({'id': applicant_id, 'score': score}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()