import sqlite3
import threading
from datetime import datetime

class SQLiteLogger:
    def __init__(self, db_path="logs.db"):
        self.db_path = db_path
        self._lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute('''
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    message TEXT NOT NULL
                )
            ''')
            conn.commit()

    def log(self, message, level="INFO"):
        timestamp = datetime.utcnow().isoformat()
        with self._lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    "INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)",
                    (timestamp, level, message)
                )
                conn.commit()

# Singleton logger instance
logger = SQLiteLogger() 