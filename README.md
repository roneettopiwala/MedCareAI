
# MedCareAI

Won best AI Project @ McHacks 2025

## Key Features & Benefits

MedCareAI aims to revolutionize healthcare access and delivery through the following key features:

*   **AI-Powered Diagnosis Assistance:** Utilizes machine learning to provide preliminary diagnosis suggestions based on user-provided symptoms and medical history.
*   **Personalized Healthcare Recommendations:** Offers tailored health advice and recommendations based on individual patient profiles and health conditions.
## Prerequisites & Dependencies

Before installing and running MedCareAI, ensure that you have the following prerequisites installed:

*   **Python 3.6 or higher:** Required for backend development and scripting.
*   **Node.js:** Required for frontend development and package management.
*   **pip:** Python package installer. Comes with most Python installations.
*   **Flask:** Python web framework.
*   **Git:** for version control and cloning the repository.
*   *Gumloop API* to gain access to the trained llm 

## Installation & Setup Instructions

Follow these steps to install and set up MedCareAI:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/roneettopiwala/MedCareAI.git
    cd MedCareAI
    ```

2.  **Set up the backend:**

    ```bash
    cd backend
    python3 -m venv venv  # Create a virtual environment
    source venv/bin/activate  # Activate the virtual environment (Linux/macOS)
    # OR
    venv\Scripts\activate  # Activate the virtual environment (Windows)
    pip install -r requirements.txt # install dependencies in the next step

    # Because of the code files provided, there isn't a complete requirements.txt, but here are the necessary ones
    pip install flask
    pip install flask_cors
    pip install requests
    cd .. # get back to the root directory
    ```

3. **IP API Key Setup:**
*   Navigate to the backend/venv/api/trigger-webhook.py file.
*   Replace `"YOUR_ACCESS_KEY"` with your actual IP API access key to access zip code information.
*   Ensure the same change is made in backend/venv/app.py

4.  **Run the backend:**

    ```bash
    cd backend/venv
    python app.py  # Or use Flask's development server
    ```

5.  **Start the frontend:** *(Assumed frontend exists - needs to be implemented)*

    *   (Assuming a basic React frontend in a `frontend` directory)
        ```bash
        cd frontend  # Navigate to the frontend directory (if it exists)
        npm install  # Install Node.js dependencies
        npm start    # Start the frontend development server
        ```
