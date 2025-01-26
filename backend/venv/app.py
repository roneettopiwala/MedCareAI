from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time

app = Flask(__name__)
CORS(app)

@app.route('/trigger-webhook', methods=['POST'])
def trigger_webhook():
    try:
        data = request.get_json()
        
        # Get city data from IP API
        zip_url = "https://api.ipapi.com/check?access_key=28dd01bf4b866caf4d8ae833d7bae3a8"
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
            "Authorization": "Bearer e24ad03b6aa34db8bf7806c348e1d084",
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

@app.route('/get-run-details', methods=['GET'])
def get_run_details():
    try:
        # Get the run_id from query parameters
        run_id = request.args.get('run_id')
        user_id = request.args.get('user_id')

        if not run_id or not user_id:
            return jsonify({"error": "Missing required parameters: run_id or user_id"}), 400
        
        url = "https://api.gumloop.com/api/v1/get_pl_run"
        headers = {
            "Authorization": "Bearer e24ad03b6aa34db8bf7806c348e1d084"
        }
        response = requests.get(url, params={"run_id": run_id, "user_id": user_id}, headers=headers)
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify({"error": "Failed to retrieve run details"}), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
