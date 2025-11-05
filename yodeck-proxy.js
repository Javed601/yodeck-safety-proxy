if (!endpoint) {
  return res.status(400).json({ error: 'Missing endpoint parameter' });
}

// Construct full Yodeck API URL
const fullUrl = `${YODECK_BASE_URL}${endpoint}`;

console.log(`Proxying ${method} request to: ${fullUrl}`);
console.log('Request data:', bodyData);

// Prepare fetch options
const fetchOptions = {
  method: method,
  headers: {
    'Authorization': YODECK_API_KEY,
    'Content-Type': 'application/json'
  }
};

// Add body for non-GET requests
if (method !== 'GET' && Object.keys(bodyData).length > 0) {
  fetchOptions.body = JSON.stringify(bodyData);
}

// Make request to Yodeck API
const response = await fetch(fullUrl, fetchOptions);
const responseText = await response.text();

console.log(`Response status: ${response.status}`);
console.log('Response body:', responseText);

// Try to parse as JSON, fallback to text
let responseData;
try {
  responseData = JSON.parse(responseText);
} catch (e) {
  responseData = { message: responseText };
}

// Return response with same status code
return res.status(response.status).json(responseData);
