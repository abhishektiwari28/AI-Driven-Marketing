import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "marketing.db")
conn = sqlite3.connect(DB_FILE)
cursor = conn.cursor()
cursor.execute("DELETE FROM ai_decisions")
conn.commit()
conn.close()
print("AI decisions cleared successfully.")
