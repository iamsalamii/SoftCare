import urllib.request
import json

data = {
    "patientId": "1",
    "doctorId": "1",
    "date": "2026-09-28T12:00:00Z",
    "type": "consultation",
    "title": "Consultation Test E2E",
    "description": "Patient test pour Lot 4",
    "symptoms": ["fièvre", "toux"],
    "diagnosis": "Rhume",
    "treatment": "Repos",
    "prescriptions": []
}

req = urllib.request.Request("http://localhost:5291/api/medicalrecords", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    response = urllib.request.urlopen(req)
    print("Status:", response.status)
    print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("Error:", e.code, e.read().decode('utf-8'))

req_get = urllib.request.Request("http://localhost:5291/api/medicalrecords")
resp = urllib.request.urlopen(req_get)
print("GET Response:", resp.read().decode('utf-8'))
