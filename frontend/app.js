// Registration Form Submission using AJAX (Fetch API)
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the form input values
    const name = document.querySelector('#registerForm input[type="text"]').value;
    const email = document.querySelector('#registerForm input[type="email"]').value;
    const password = document.querySelector('#registerForm input[type="password"]').value;

    // Create the payload to send to the backend
    const payload = {
        name,
        email,
        password
    };

    // Send data using fetch API
    fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload) // Convert payload to JSON string
    })
    .then(response => response.json())
    .then(data => {
        console.log('User registered:', data);
        alert('Registration successful!');
        // Optionally, close the modal and clear form fields
        document.getElementById('authModal').style.display = 'none';
        document.getElementById('registerForm').reset(); // Clear form fields
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed!');
    });
});
