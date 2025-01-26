from flask import Flask, request, jsonify
import requests
import time

app = Flask(__name__)

@app.route('/trigger-webhook', methods=['POST'])
def trigger_webhook():
    try:
        data = request.get_json()
        
        # Get city data from IP API
        zip_url = "https://api.ipapi.com/check?access_key=YOUR_ACCESS_KEY"
        zip_response = requests.get(zip_url)
        zip_data = zip_response.json()
        zip = zip_data.get("zip", "Unknown")
        
        # Add city to pipeline inputs
        pipeline_inputs = data["pipeline_inputs"]
        pipeline_inputs.append({
            "input_name": "Zip",
            "value": zip
        })
        
        # Start pipeline
        url = "https://api.gumloop.com/api/v1/start_pipeline"
        payload = {
            "user_id": data["user_id"],
            "saved_item_id": data["saved_item_id"],
            "pipeline_inputs": pipeline_inputs
        }
        headers = {
            "Authorization": "Bearer YOUR_API_KEY",
            "Content-Type": "application/json"
        }

        # Start the pipeline
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        run_data = response.json()
        run_id = run_data['run_id']

        # Poll for results
        result_url = f"https://api.gumloop.com/api/v1/get_pl_run"
        max_attempts = 30
        while max_attempts > 0:
            result_response = requests.get(result_url, 
                                           params={"run_id": run_id, "user_id": data["user_id"]}, 
                                           headers=headers)
            if result_response.status_code == 200:
                result = result_response.json()
                if result.get('state') == 'DONE':
                    return jsonify({"output": result.get('outputs', {})}), 200
            time.sleep(2)
            max_attempts -= 1

        return jsonify({"error": "Pipeline timeout"}), 408

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
