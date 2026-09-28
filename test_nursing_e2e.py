import requests
import psycopg2

BASE_URL = "http://localhost:5291/api"
DB_CONN = "dbname=softcare user=postgres password=postgres host=localhost port=5432"

def test_nursing():
    print("=== STARTING NURSING E2E TEST ===")
    
    # 1. Login
    r = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@hopital.com", "password": "admin"})
    if r.status_code != 200:
        print("Login failed:", r.text)
        return
    token = r.json().get('token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Logged in successfully.")

    # 2. Get a patient
    r = requests.get(f"{BASE_URL}/patients", headers=headers)
    patients = r.json()
    if not patients:
        print("No patients found. Please add a patient first.")
        return
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
    r = requests.post(f"{BASE_URL}/nursing/vitals", json=vital_data, headers=headers)
    if r.status_code != 200:
        print("Failed to create vital record:", r.text)
        return
    vital_id = r.json()['id']
    print(f"Created vital record: {vital_id}")

    # 4. Create Care Plan
    plan_data = {
        "patientId": patient_id,
        "title": "Surveillance post-op",
        "frequency": "Toutes les 4 heures",
        "instructions": "Vérifier la plaie et administrer les antalgiques",
        "status": "active"
    }
    r = requests.post(f"{BASE_URL}/nursing/care-plans", json=plan_data, headers=headers)
    if r.status_code != 200:
        print("Failed to create care plan:", r.text)
        return
    plan_id = r.json()['id']
    print(f"Created care plan: {plan_id}")

    # 5. Create Nursing Note
    note_data = {
        "patientId": patient_id,
        "category": "transmission",
        "content": "Patient calme, a bien dormi."
    }
    r = requests.post(f"{BASE_URL}/nursing/notes", json=note_data, headers=headers)
    if r.status_code != 200:
        print("Failed to create nursing note:", r.text)
        return
    note_id = r.json()['id']
    print(f"Created nursing note: {note_id}")

    # 6. Verify with GET requests
    r = requests.get(f"{BASE_URL}/nursing/vitals/patient/{patient_id}", headers=headers)
    assert any(v['id'] == vital_id for v in r.json()), "Vital record not found in GET"
    
    r = requests.get(f"{BASE_URL}/nursing/care-plans/patient/{patient_id}", headers=headers)
    assert any(p['id'] == plan_id for p in r.json()), "Care plan not found in GET"

    r = requests.get(f"{BASE_URL}/nursing/notes/patient/{patient_id}", headers=headers)
    assert any(n['id'] == note_id for n in r.json()), "Nursing note not found in GET"
    
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
