// Vercel Function to proxy Yodeck API calls and bypass CORS
// Deploy this to Vercel for free hosting

const YODECK_API_KEY = 'Token yodeck:2NNyE3N_Fg3LP2D60c-nGn857Xhv_-Mh0N03kLpufYmnob2FJ2gSnlXBU758Kr3k';
const YODECK_BASE_URL = 'https://app.yodeck.com/api/v2';

module.exports = async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'CORS preflight successful' });
  }

  try {
    // For GET requests, endpoint might be in query string
    const { endpoint, ...bodyData } = req.body || {};
    const queryEndpoint = req.query?.endpoint;
    const finalEndpoint = endpoint || queryEndpoint;
    const method = req.method;

    if (!finalEndpoint) {
      return res.status(400).json({ error: 'Missing endpoint parameter' });
    }

    // Construct full Yodeck API URL
    const fullUrl = `${YODECK_BASE_URL}${finalEndpoint}`;
    
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

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: error.message,
      details: 'Internal server error in Yodeck proxy'
    });
  }
};
