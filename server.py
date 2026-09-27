import http.server
import socketserver
import json
import os
import urllib.parse

PORT = 8000
DATA_FILE = os.path.join(os.path.dirname(__file__), "data.json")

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {
        "patients": [
            {
                "id": "PAT-1001",
                "name": "Rahul Sharma",
                "age": 34,
                "gender": "Male",
                "bloodGroup": "O+",
                "phone": "+91 98765 43210",
                "emergencyContact": "+91 98765 00000",
                "address": "B-402, Green Valley Apts, Sector 14",
                "notes": "Hypertension, allergic to Penicillin",
                "regDate": "2026-09-10"
            }
        ],
        "appointments": [],
        "emergencies": [],
        "ambulances": [],
        "bloodBanks": [],
        "hospitals": []
    }

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

class MediPulseRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path.startswith("/api/"):
            self.handle_api_get(parsed_url.path)
        else:
            super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        try:
            payload = json.loads(body) if body else {}
        except Exception:
            payload = {}

        if parsed_url.path.startswith("/api/"):
            self.handle_api_post(parsed_url.path, payload)
        else:
            self.send_error(404, "Endpoint not found")

    def handle_api_get(self, path):
        db = load_data()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        if path == "/api/health":
            response = {"status": "ok", "service": "MediPulse Backend Server"}
        elif path == "/api/data":
            response = db
        elif path == "/api/patients":
            response = db.get("patients", [])
        elif path == "/api/appointments":
            response = db.get("appointments", [])
        elif path == "/api/emergencies":
            response = db.get("emergencies", [])
        else:
            response = {"error": "Invalid API route"}

        self.wfile.write(json.dumps(response).encode("utf-8"))

    def handle_api_post(self, path, payload):
        db = load_data()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        response = {"success": True}

        if path == "/api/patients":
            db.setdefault("patients", []).insert(0, payload)
            save_data(db)
            response["data"] = payload
        elif path == "/api/appointments":
            db.setdefault("appointments", []).insert(0, payload)
            save_data(db)
            response["data"] = payload
        elif path == "/api/emergencies":
            db.setdefault("emergencies", []).insert(0, payload)
            save_data(db)
            response["data"] = payload
        else:
            response = {"success": False, "error": "Unknown API route"}

        self.wfile.write(json.dumps(response).encode("utf-8"))

if __name__ == "__main__":
    print(f"[MediPulse] Android & Web Server running on http://localhost:{PORT}")
    with socketserver.TCPServer(("", PORT), MediPulseRequestHandler) as httpd:
        httpd.serve_forever()

