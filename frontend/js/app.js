// Grab the elements from the HTML
const statusBox = document.getElementById('status-box');
const testBtn = document.getElementById('test-btn');

// The URL of our Spring Boot backend
const API_URL = 'http://localhost:8080/api/hello';

// We use 'async/await' because fetching data over the network takes time
async function testBackendConnection() {
    // Reset UI to loading state
    statusBox.className = 'status-box loading';
    statusBox.textContent = 'Contacting backend...';
    
    try {
        // fetch() is the modern Vanilla JS way to make network requests
        // By default, it makes an HTTP GET request
        const response = await fetch(API_URL);
        
        // Check if the HTTP status code is 200 OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON data sent by the backend controller
        const data = await response.json();
        
        // Update the UI with the success message from the backend
        statusBox.className = 'status-box success';
        statusBox.textContent = `Success: ${data.message}`;
        
    } catch (error) {
        console.error('Error fetching from backend:', error);
        statusBox.className = 'status-box error';
        statusBox.textContent = 'Error: Could not connect to backend. Is it running on port 8080?';
    }
}

// Automatically test the connection when the page loads
testBackendConnection();

// Test the connection manually when the button is clicked
testBtn.addEventListener('click', testBackendConnection);
