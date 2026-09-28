import urllib.request
import urllib.error
import json
import psycopg2
import time

BASE_URL = "http://localhost:5291/api"
DB_CONN = "dbname=softcare user=postgres password=postgres host=localhost port=5432"

def make_request(method, url, data=None, headers=None):
    if headers is None: headers = {}
    if data is not None:
        data = json.dumps(data).encode('utf-8')
        headers['Content-Type'] = 'application/json'
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return response.status, json.loads(res_data) if res_data else None
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8')
    except Exception as e:
        return 0, str(e)

def test_nursing():
    print("=== STARTING NURSING E2E TEST ===")
    
    # 1. Login
    status, res = make_request("POST", f"{BASE_URL}/auth/login", {"email": "admin@hopital.com", "password": "Admin123!"})
    if status != 200:
        print("Login failed:", res)
        return
    token = res.get('token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Logged in successfully.")

    # 2. Get a patient
    status, patients = make_request("GET", f"{BASE_URL}/patients", headers=headers)
    if not patients:
        print("No patients found. Creating a test patient...")
        patient_data = {
            "firstName": "Jean",
            "lastName": "Dupont",
            "dateOfBirth": "1980-01-01",
            "socialSecurityNumber": "123456789012345",
            "bloodType": "A+",
            "gender": "M",
            "contactNumber": "0600000000",
            "address": "Paris",
            "email": "jean.dupont@test.com",
            "emergencyContact": "Marie Dupont - 0600000001"
        }
        status, res = make_request("POST", f"{BASE_URL}/patients", data=patient_data, headers=headers)
        if status != 200:
            print("Failed to create patient:", res)
            return
        patient_id = res['id']
    else:
        patient_id = patients[0]['id']
    print(f"Using patient: {patient_id}")

    # 3. Create Vital Record
    vital_data = {
        "patientId": patient_id,
        "bloodPressureSys": 120,
        "bloodPressureDia": 80,
        "heartRate": 70,
        "temperature": 37.5,
        "spO2": 98,
        "respiratoryRate": 16,
        "painScale": 2,
        "notes": "Test vital record"
    }
    status, res = make_request("POST", f"{BASE_URL}/nursing/vitals", data=vital_data, headers=headers)
    if status != 200:
        print("Failed to create vital record:", res)
        return
    vital_id = res['id']
    print(f"Created vital record: {vital_id}")

    # 4. Create Care Plan
    plan_data = {
        "patientId": patient_id,
        "title": "Surveillance post-op",
        "frequency": "Toutes les 4 heures",
        "instructions": "Vérifier la plaie et administrer les antalgiques",
        "status": "active"
    }
    status, res = make_request("POST", f"{BASE_URL}/nursing/care-plans", data=plan_data, headers=headers)
    if status != 200:
        print("Failed to create care plan:", res)
        return
    plan_id = res['id']
    print(f"Created care plan: {plan_id}")

    # 5. Create Nursing Note
    note_data = {
        "patientId": patient_id,
        "category": "transmission",
        "content": "Patient calme, a bien dormi."
    }
    status, res = make_request("POST", f"{BASE_URL}/nursing/notes", data=note_data, headers=headers)
    if status != 200:
        print("Failed to create nursing note:", res)
        return
    note_id = res['id']
    print(f"Created nursing note: {note_id}")

    # 6. Verify with GET requests
    status, vitals = make_request("GET", f"{BASE_URL}/nursing/vitals/patient/{patient_id}", headers=headers)
    assert any(v['id'] == vital_id for v in vitals), "Vital record not found in GET"
    
    status, plans = make_request("GET", f"{BASE_URL}/nursing/care-plans/patient/{patient_id}", headers=headers)
    assert any(p['id'] == plan_id for p in plans), "Care plan not found in GET"

    status, notes = make_request("GET", f"{BASE_URL}/nursing/notes/patient/{patient_id}", headers=headers)
    assert any(n['id'] == note_id for n in notes), "Nursing note not found in GET"
    
    print("GET verifications passed.")

    # 7. Verify in PostgreSQL DB
    conn = psycopg2.connect(DB_CONN)
    cur = conn.cursor()
    
    cur.execute(f"SELECT * FROM \"VitalRecords\" WHERE \"Id\" = '{vital_id}'")
    assert cur.fetchone() is not None, "Vital record not in DB"
    
    cur.execute(f"SELECT * FROM \"CarePlans\" WHERE \"Id\" = '{plan_id}'")
    assert cur.fetchone() is not None, "Care plan not in DB"
    
    cur.execute(f"SELECT * FROM \"NursingNotes\" WHERE \"Id\" = '{note_id}'")
    assert cur.fetchone() is not None, "Nursing note not in DB"
    
    print("DB verifications passed.")
    print("=== NURSING E2E TEST PASSED ===")
    
if __name__ == '__main__':
    test_nursing()
