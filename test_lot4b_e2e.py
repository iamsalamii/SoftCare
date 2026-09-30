import urllib.request
import urllib.error
import json
import psycopg2

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

def test_urgences_lab():
    print("=== STARTING URGENCES & LAB E2E TEST ===")
    
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
        print("No patients found.")
        return
    patient_id = patients[0]['id']
    print(f"Using patient: {patient_id}")

    # 3. Create Emergency Visit
    visit_data = {
        "patientId": patient_id,
        "chiefComplaint": "Douleur thoracique",
        "triageLevel": 1,
        "arrivalMode": "ambulance",
        "notes": "Test urgence"
    }
    status, res = make_request("POST", f"{BASE_URL}/emergency/visits", data=visit_data, headers=headers)
    if status != 200 and status != 201:
        print("Failed to create emergency visit:", res)
    else:
        visit_id = res['id']
        print(f"Created emergency visit: {visit_id}")
        
        # Verify with GET
        status, visits = make_request("GET", f"{BASE_URL}/emergency/visits", headers=headers)
        if any(v['id'] == visit_id for v in visits):
            print("GET /emergency/visits passed.")
        else:
            print("GET /emergency/visits failed: record not found.")

    # 4. Create Lab Order
    order_data = {
        "patientId": patient_id,
        "priority": "stat",
        "status": "pending",
        "notes": "Bilan sanguin"
    }
    status, res = make_request("POST", f"{BASE_URL}/lab/orders", data=order_data, headers=headers)
    if status != 200 and status != 201:
        print("Failed to create lab order:", res)
    else:
        order_id = res['id']
        print(f"Created lab order: {order_id}")
        
        # Verify with GET
        status, orders = make_request("GET", f"{BASE_URL}/lab/orders", headers=headers)
        if any(o['id'] == order_id for o in orders):
            print("GET /lab/orders passed.")
        else:
            print("GET /lab/orders failed: record not found.")

    print("=== TEST COMPLETED ===")
    
if __name__ == '__main__':
    test_urgences_lab()
