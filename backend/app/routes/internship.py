from flask import Blueprint, request, jsonify
from app.utils.database import get_db_connection
import uuid
import logging
import psycopg2

logging.basicConfig(level=logging.DEBUG)

bp = Blueprint('internship', __name__)

@bp.route('/create', methods=['POST'])
def create_internship():
    company_id = request.form.get('company_id')
    title = request.form.get('title')
    sector = request.form.get('sector')
    area = request.form.get('area')
    description = request.form.get('description')
    skills = request.form.get('skills')
    keywords = request.form.get('keywords')
    special_requirements = request.form.get('special_requirements')
    work_mode = request.form.get('work_mode')
    intake = request.form.get('intake')
    start_date = request.form.get('start_date')
    deadline = request.form.get('deadline')
    plugin = request.form.get('plugin')

    # Validate required fields
    required_fields = [company_id, title, sector, area, description, intake, work_mode, start_date, deadline]
    if not all(required_fields):
        logging.error(f"Missing required fields: {required_fields}")
        return jsonify({'error': 'Missing required fields'}), 400

    # Validate intake
    try:
        intake = int(intake)
        if intake <= 0:
            raise ValueError
    except ValueError:
        logging.error(f"Invalid intake: {intake}")
        return jsonify({'error': 'Intake must be a positive integer'}), 400

    # Validate dates
    try:
        from datetime import datetime
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(deadline, '%Y-%m-%d')
        if start >= end:
            logging.error(f"Invalid dates: start_date={start_date}, deadline={deadline}")
            return jsonify({'error': 'Deadline must be after start date'}), 400
    except ValueError:
        logging.error(f"Invalid date format: start_date={start_date}, deadline={deadline}")
        return jsonify({'error': 'Invalid date format (use YYYY-MM-DD)'}), 400

    conn = get_db_connection()
    if not conn:
        logging.error("Database connection failed")
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        # Verify company exists and is approved
        cursor.execute("SELECT id FROM companies WHERE id = %s AND status = 'approved'", (company_id,))
        company = cursor.fetchone()
        if not company:
            conn.close()
            logging.error(f"Company not found or not approved: {company_id}")
            return jsonify({'error': 'Company not found or not approved'}), 403

        internship_id = str(uuid.uuid4())
        cursor.execute(
            """
            INSERT INTO internships (
                id, company_id, title, sector, area, description, skills, keywords,
                special_requirements, work_mode, intake, start_date, deadline, status, plugin
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
            """,
            (internship_id, company_id, title, sector, area, description, skills, keywords,
             special_requirements, work_mode, intake, start_date, deadline, 'pending', plugin)
        )
        conn.commit()
        logging.info(f"Internship created: {internship_id}")
        return jsonify({'id': internship_id, 'message': 'Internship submitted for approval'}), 201
    except psycopg2.Error as e:
        conn.rollback()
        logging.error(f"Database error creating internship: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        logging.error(f"Error creating internship: {str(e)}")
        return jsonify({'error': str(e)}), 400
    finally:
        conn.close()

@bp.route('/suggestions', methods=['POST'])
def get_suggestions():
    data = request.get_json()
    title = data.get('title')
    sector = data.get('sector')
    area = data.get('area')
    description = data.get('description')
    prompt = data.get('prompt', '')

    if not all([title, sector, area, description]):
        logging.error(f"Missing suggestion fields: title={title}, sector={sector}, area={area}, description={description}")
        return jsonify({'error': 'Missing required fields for suggestions'}), 400

    # Mock AI suggestions (replace with actual Grok 3 API call in production)
    suggestions = {
        'skills': ['Python', 'SQL', 'Data Analysis'],
        'keywords': ['data', 'analytics', 'internship'],
        'special_requirements': ['Background verification required'],
        'description': description + ' (Enhanced by AI: Focus on real-world projects)'
    }
    logging.info("Returning mock AI suggestions")
    return jsonify({'suggestions': suggestions}), 200

@bp.route('/company/<company_id>', methods=['GET'])
def get_company_internships(company_id):
    conn = get_db_connection()
    if not conn:
        logging.error("Database connection failed")
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, title, status, created_at
            FROM internships WHERE company_id = %s
            """,
            (company_id,)
        )
        internships = cursor.fetchall()
        conn.close()
        logging.info(f"Fetched internships for company: {company_id}")
        return jsonify([
            {
                'id': row['id'],
                'title': row['title'],
                'status': row['status'],
                'created_at': row['created_at'].isoformat()
            } for row in internships
        ]), 200
    except psycopg2.Error as e:
        conn.close()
        logging.error(f"Database error fetching internships for company {company_id}: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.close()
        logging.error(f"Error fetching internships for company {company_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/all', methods=['GET'])
def get_all_internships():
    user_type = request.args.get('user_type', 'student')
    conn = get_db_connection()
    if not conn:
        logging.error("Database connection failed")
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        query = """
            SELECT i.id, i.title, i.sector, i.area, i.description, i.skills, i.keywords,
                   i.special_requirements, i.work_mode, i.intake, i.start_date, i.deadline,
                   i.status, i.plugin, i.created_at, c.name as company_name
            FROM internships i
            JOIN companies c ON i.company_id = c.id
        """
        params = []
        if user_type == 'student':
            query += " WHERE i.status = 'approved'"
        cursor.execute(query, params)
        internships = cursor.fetchall()
        conn.close()
        logging.info(f"Fetched all internships for user_type: {user_type}")
        return jsonify([
            {
                'id': row['id'],
                'title': row['title'],
                'sector': row['sector'],
                'area': row['area'],
                'description': row['description'],
                'skills': row['skills'],
                'keywords': row['keywords'],
                'special_requirements': row['special_requirements'],
                'work_mode': row['work_mode'],
                'intake': row['intake'],
                'start_date': row['start_date'].isoformat() if row['start_date'] else None,
                'deadline': row['deadline'].isoformat() if row['deadline'] else None,
                'status': row['status'],
                'plugin': row['plugin'],
                'created_at': row['created_at'].isoformat(),
                'company_name': row['company_name']
            } for row in internships
        ]), 200
    except psycopg2.Error as e:
        conn.close()
        logging.error(f"Database error fetching all internships: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.close()
        logging.error(f"Error fetching all internships: {str(e)}")
        return jsonify({'error': str(e)}), 500

@bp.route('/admin/internship/approve/<internship_id>', methods=['POST'])
def approve_internship(internship_id):
    admin_id = request.headers.get('Admin-ID')
    logging.debug(f"Approve internship {internship_id} with Admin-ID: {admin_id}")
    if not admin_id:
        logging.error("Admin-ID header missing")
        return jsonify({'error': 'Admin authentication required'}), 401

    conn = get_db_connection()
    if not conn:
        logging.error("Database connection failed")
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        # Verify admin exists
        cursor.execute("SELECT id FROM admins WHERE id = %s", (admin_id,))
        admin = cursor.fetchone()
        logging.debug(f"Admin query result: {admin}")
        if not admin:
            conn.close()
            logging.error(f"Admin not found: {admin_id}")
            return jsonify({'error': 'Admin not found'}), 403

        # Verify internship exists
        cursor.execute("SELECT id, status FROM internships WHERE id = %s", (internship_id,))
        internship = cursor.fetchone()
        logging.debug(f"Internship query result: {internship}")
        if not internship:
            conn.close()
            logging.error(f"Internship not found: {internship_id}")
            return jsonify({'error': 'Internship not found'}), 404
        if internship['status'] != 'pending':
            conn.close()
            logging.error(f"Internship not in pending status: {internship['status']}")
            return jsonify({'error': 'Internship not in pending status'}), 400

        # Update internship status
        cursor.execute(
            "UPDATE internships SET status = 'approved' WHERE id = %s",
            (internship_id,)
        )
        conn.commit()
        logging.info(f"Internship {internship_id} approved by admin {admin_id}")
        return jsonify({'message': 'Internship approved', 'id': internship_id}), 200
    except psycopg2.Error as e:
        conn.rollback()
        logging.error(f"Database error approving internship {internship_id}: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        logging.error(f"Error approving internship {internship_id}: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        conn.close()

@bp.route('/admin/internship/deny/<internship_id>', methods=['POST'])
def deny_internship(internship_id):
    admin_id = request.headers.get('Admin-ID')
    logging.debug(f"Deny internship {internship_id} with Admin-ID: {admin_id}")
    if not admin_id:
        logging.error("Admin-ID header missing")
        return jsonify({'error': 'Admin authentication required'}), 401

    conn = get_db_connection()
    if not conn:
        logging.error("Database connection failed")
        return jsonify({'error': 'Database connection failed'}), 500

    cursor = conn.cursor()
    try:
        # Verify admin exists
        cursor.execute("SELECT id FROM admins WHERE id = %s", (admin_id,))
        admin = cursor.fetchone()
        logging.debug(f"Admin query result: {admin}")
        if not admin:
            conn.close()
            logging.error(f"Admin not found: {admin_id}")
            return jsonify({'error': 'Admin not found'}), 403

        # Verify internship exists
        cursor.execute("SELECT id, status FROM internships WHERE id = %s", (internship_id,))
        internship = cursor.fetchone()
        logging.debug(f"Internship query result: {internship}")
        if not internship:
            conn.close()
            logging.error(f"Internship not found: {internship_id}")
            return jsonify({'error': 'Internship not found'}), 404
        if internship['status'] != 'pending':
            conn.close()
            logging.error(f"Internship not in pending status: {internship['status']}")
            return jsonify({'error': 'Internship not in pending status'}), 400

        # Update internship status
        cursor.execute(
            "UPDATE internships SET status = 'rejected' WHERE id = %s",
            (internship_id,)
        )
        conn.commit()
        logging.info(f"Internship {internship_id} rejected by admin {admin_id}")
        return jsonify({'message': 'Internship rejected', 'id': internship_id}), 200
    except psycopg2.Error as e:
        conn.rollback()
        logging.error(f"Database error rejecting internship {internship_id}: {str(e)}")
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        conn.rollback()
        logging.error(f"Error rejecting internship {internship_id}: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        conn.close()