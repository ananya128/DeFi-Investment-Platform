const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { auth } = require('express-oauth2-jwt-bearer');
const multer = require('multer');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

const authConfig = {
  domain: "dev-b3clsyr1vtq0iuvi.us.auth0.com",
  audience: "https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/",
  clientId: "YR6lONX7ULdlSJ2Su636h9NZQRzJmC8R",
  clientSecret: "hblVvf4RIUKoe_UXfuo6BLx8rtew2oAHoX7QB8AzNLZTAM0M08KqyHJxZTRSDY8u"
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Middleware to clear unnecessary cookies
app.use((req, res, next) => {
  // Remove specific cookies that are not needed or are too large
  res.clearCookie('_legacy_auth0.YR6lONX7ULdlSJ2Su636h9NZQRzJmC8R');
  res.clearCookie('auth0.YR6lONX7ULdlSJ2Su636h9NZQRzJmC8R');

  // Log the cookies being sent for debugging
  console.log('Cookies:', req.cookies);

  next();
});

// Middleware to check JWT
const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  tokenSigningAlg: 'RS256'
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas', err);
    process.exit(1); // Exit the process with an error code
  });

// Define Investment schema and model
const InvestmentSchema = new mongoose.Schema({
  userId: String,
  name: String,
  amount: Number,
  date: Date,
});

const Investment = mongoose.model('Investment', InvestmentSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Proxy setup
app.use('/api', createProxyMiddleware({
  target: 'https://api.coingecko.com/api/v3',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // remove /api prefix when forwarding to the target
  },
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint to handle profile updates
app.post('/profile', checkJwt, upload.single('picture'), async (req, res) => {
  const { name, email } = req.body;
  const picture = req.file ? `/uploads/${req.file.filename}` : req.body.picture;
  const userId = req.auth.payload.sub; // Auth0 user ID

  try {
    const managementToken = await getManagementToken();
    const response = await fetch(`https://${authConfig.domain}/api/v2/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_metadata: { name, email, picture } })
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedProfile = await response.json();
    res.json(updatedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Function to get management token
const getManagementToken = async () => {
  const response = await fetch(`https://${authConfig.domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: authConfig.clientId,
      client_secret: authConfig.clientSecret,
      audience: `https://${authConfig.domain}/api/v2/`,
      grant_type: 'client_credentials'
    })
  });

  if (!response.ok) {
    throw new Error('Failed to get management token');
  }

  const { access_token } = await response.json();
  return access_token;
};

// Portfolio Management Endpoints
app.get('/portfolio', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  const investments = await Investment.find({ userId });
  res.json(investments);
});

app.post('/portfolio', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  const { name, amount, date } = req.body;
  const newInvestment = new Investment({ userId, name, amount, date });
  await newInvestment.save();
  res.status(201).json(newInvestment);
});

app.put('/portfolio/:id', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  const { id } = req.params;
  const { name, amount, date } = req.body;
  const updatedInvestment = await Investment.findOneAndUpdate(
    { _id: id, userId },
    { name, amount, date },
    { new: true }
  );
  res.json(updatedInvestment);
});

app.delete('/portfolio/:id', checkJwt, async (req, res) => {
  const userId = req.auth.payload.sub;
  const { id } = req.params;
  await Investment.findOneAndDelete({ _id: id, userId });
  res.status(204).send();
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
