from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def home():
    return render_template('index.html')  # This will render your HTML page

@app.route('/register', methods=['POST'])
def register():
    # Handle registration logic here
    username = request.form['username']
    password = request.form['password']
    # Process the registration data and store it in your database
    return redirect(url_for('home'))  # Redirect back to the homepage after successful registration

@app.route('/login', methods=['POST'])
def login():
    # Handle login logic here
    username = request.form['username']
    password = request.form['password']
    # Validate login credentials
    return redirect(url_for('home'))  # Redirect back to the homepage after successful login

if __name__ == '__main__':
    app.run(debug=True)
