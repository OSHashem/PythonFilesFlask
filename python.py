from flask import Flask, jsonify, request
import os

print("Current working directory:", os.getcwd())
app = Flask(__name__)

# Route to receive data from Node.js and send a response
@app.route('/process-data', methods=['POST'])
def process_data():
    data = request.json  # Receive JSON data sent from Node.js
    # Perform some operations with the data
    result = {'message': 'Data received', 'yourData': data}
    return jsonify(result)  # Send response back to Node.js

if __name__ == '__main__':
    app.run(port=5000, debug=True)
