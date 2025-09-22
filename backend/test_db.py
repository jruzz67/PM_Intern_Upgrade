from app.utils.database import get_db_connection

conn = get_db_connection()
if conn:
    cursor = conn.cursor()
    tables = ['students', 'companies', 'internships', 'accolade_knowledge_base', 'applications']
    for table in tables:
        cursor.execute(f"SELECT * FROM {table}")
        print(f"{table}:", cursor.fetchall())
    conn.close()
    print("Database connection successful!")
else:
    print("Failed to connect to database.")