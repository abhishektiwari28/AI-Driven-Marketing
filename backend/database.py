import sqlite3
import json
import os
from typing import Dict, List, Any
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "marketing.db")

class SQLiteDB:
    def __init__(self):
        self.conn = sqlite3.connect(DB_FILE, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self._create_tables()
        self._seed_if_empty()

    def _create_tables(self):
        cursor = self.conn.cursor()
        
        # Campaigns Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                status TEXT NOT NULL,
                budget REAL,
                spent REAL,
                objective TEXT,
                platforms TEXT,
                strategy TEXT,
                recommendation TEXT,
                roi_forecast TEXT,
                timeline TEXT,
                broadcast_log TEXT,
                created_at TEXT
            )
        """)
        
        # Metrics Table (Historical)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id TEXT,
                platform TEXT,
                data TEXT,
                timestamp TEXT,
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
            )
        """)
        
        # AI Decisions Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS ai_decisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                campaign_id TEXT,
                decision_type TEXT,
                data TEXT,
                timestamp TEXT,
                FOREIGN KEY (campaign_id) REFERENCES campaigns (id)
            )
        """)
        
        self.conn.commit()

    def _seed_if_empty(self):
        # We start with an empty database as per requirements
        pass

    def get_campaigns(self) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()
        cursor.execute("SELECT * FROM campaigns ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        campaigns = []
        for row in rows:
            c = dict(row)
            # Json loads for complex fields
            for field in ["platforms", "strategy", "recommendation", "roi_forecast", "timeline", "broadcast_log"]:
                if c[field]:
                    c[field] = json.loads(c[field])
            campaigns.append(c)
        return campaigns

    def add_campaign(self, c: Dict[str, Any]):
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO campaigns (id, name, status, budget, spent, objective, platforms, strategy, recommendation, roi_forecast, timeline, broadcast_log, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c["id"], c["name"], c["status"], c.get("budget", 0), c.get("spent", 0), 
            c.get("objective"), json.dumps(c.get("platforms", [])), 
            json.dumps(c.get("strategy", {})), json.dumps(c.get("recommendation", {})),
            json.dumps(c.get("roi_forecast", {})), json.dumps(c.get("timeline", {})),
            json.dumps(c.get("broadcast_log", {})), c.get("created_at", datetime.now().isoformat())
        ))
        self.conn.commit()

    def log_metrics(self, campaign_id: str, platform: str, data: Dict[str, Any]):
        cursor = self.conn.cursor()
        cursor.execute("INSERT INTO metrics (campaign_id, platform, data, timestamp) VALUES (?, ?, ?, ?)",
                       (campaign_id, platform, json.dumps(data), datetime.now().isoformat()))
        self.conn.commit()

    def log_ai_decision(self, campaign_id: str, decision_type: str, data: Dict[str, Any]):
        cursor = self.conn.cursor()
        formatted_now = datetime.now().strftime("%b %d, %I:%M %p")
        cursor.execute("INSERT INTO ai_decisions (campaign_id, decision_type, data, timestamp) VALUES (?, ?, ?, ?)",
                       (campaign_id, decision_type, json.dumps(data), formatted_now))
        self.conn.commit()

    def get_insights(self, campaign_id: str = None) -> List[Dict[str, Any]]:
        cursor = self.conn.cursor()
        if campaign_id and campaign_id != 'all':
            cursor.execute("SELECT * FROM ai_decisions WHERE campaign_id = ? ORDER BY timestamp DESC LIMIT 10", (campaign_id,))
        else:
            cursor.execute("SELECT * FROM ai_decisions ORDER BY timestamp DESC LIMIT 10")
        rows = cursor.fetchall()

        
        insights = []
        for row in rows:
            ins = dict(row)
            if ins["data"]:
                ins["data"] = json.loads(ins["data"])
            insights.append(ins)
        return insights

    def update_campaign_status(self, campaign_id: str, status: str):
        cursor = self.conn.cursor()
        cursor.execute("UPDATE campaigns SET status = ? WHERE id = ?", (status, campaign_id))
        self.conn.commit()
        return cursor.rowcount > 0

    def update_campaign(self, campaign_id: str, updates: Dict[str, Any]):
        """Updates generic fields of a campaign."""
        cursor = self.conn.cursor()
        
        fields = []
        values = []
        
        for key, value in updates.items():
            if key in ["platforms", "strategy", "recommendation", "roi_forecast", "timeline", "broadcast_log"]:
                fields.append(f"{key} = ?")
                values.append(json.dumps(value))
            else:
                fields.append(f"{key} = ?")
                values.append(value)
        
        values.append(campaign_id)
        
        if not fields:
            return False
            
        sql = f"UPDATE campaigns SET {', '.join(fields)} WHERE id = ?"
        cursor.execute(sql, tuple(values))
        self.conn.commit()
        return cursor.rowcount > 0

    def delete_campaign(self, campaign_id: str):
        cursor = self.conn.cursor()
        cursor.execute("DELETE FROM campaigns WHERE id = ?", (campaign_id,))
        self.conn.commit()
        return cursor.rowcount > 0

db = SQLiteDB()
