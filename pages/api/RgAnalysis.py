from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def predict_next_points(values, window_size=5, future_points=8):
    predictions = []
    last_window = values[-window_size:]
    
    for _ in range(future_points):
        # Create features from the sliding window
        X = np.arange(window_size).reshape(-1, 1)
        y = np.array(last_window)
        
        # Train model on the window
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next point
        next_point = model.predict([[window_size]])[0]
        predictions.append(float(next_point))
        
        # Update window for next prediction
        last_window = np.append(last_window[1:], next_point)
    
    return predictions

@app.route('/analyze', methods=['POST'])
def analyze_regression():
    try:
        data = request.get_json()
        
        if not data or 'values' not in data:
            return jsonify({'error': 'No data provided'}), 400

        values = np.array(data['values'])
        
        # Basic regression analysis
        X = np.arange(len(values)).reshape(-1, 1)
        y = values

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = LinearRegression()
        model.fit(X_train, y_train)

        # Calculate basic metrics
        slope = model.coef_[0]
        intercept = model.intercept_
        r_squared = model.score(X, y)
        y_pred = model.predict(X_test)

        # Get multiple future predictions using sliding window
        future_predictions = predict_next_points(
            values, 
            window_size=min(5, len(values)), 
            future_points=8
        )

        return jsonify({
            'slope': float(slope),
            'intercept': float(intercept),
            'r_squared': float(r_squared),
            'test_predictions': y_pred.tolist(),
            'test_indices': X_test.flatten().tolist(),
            'future_predictions': future_predictions
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)