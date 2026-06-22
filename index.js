require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const app     = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');


const HUBSPOT_TOKEN = process.env.PRIVATE_APP_ACCESS_TOKEN;

// Your custom object API name — found in HubSpot data model settings
// Example: 'p_pets'  or  'p_plants'
const OBJECT_TYPE = 'motos';

// Internal names of your three custom properties
const PROPERTY_1 = 'name';           // Required — must be 'name'
const PROPERTY_2 = 'date';           // Replace with your 2nd property's internal name
const PROPERTY_3 = 'type';          // Replace with your 3rd property's internal name

// Friendly column labels shown in the homepage table
const COL_1_LABEL = 'Name';
const COL_2_LABEL = 'Date';       // Replace with a readable label
const COL_3_LABEL = 'Type';      // Replace with a readable label


// ── ROUTE 1: Homepage ── GET /
// Fetches all records from your custom object and renders the table
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        params: {
          properties: `${PROPERTY_1},${PROPERTY_2},${PROPERTY_3}`,
          limit: 100
        },
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const records = response.data.results;
    res.render('homepage', {
      title: 'Custom Object List | Integrating With HubSpot I Practicum',
      records,
      col1: COL_1_LABEL, col2: COL_2_LABEL, col3: COL_3_LABEL,
      prop1: PROPERTY_1, prop2: PROPERTY_2, prop3: PROPERTY_3
    });
  } catch (error) {
    console.error('Error fetching records:', error.response?.data || error.message);
    res.status(500).send('Error fetching records — check your terminal.');
  }
});

// ── ROUTE 2: Show Form ── GET /update-cobj
// Renders the HTML form for creating a new record
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
    col1: COL_1_LABEL, col2: COL_2_LABEL, col3: COL_3_LABEL,
    prop1: PROPERTY_1, prop2: PROPERTY_2, prop3: PROPERTY_3
  });
});

// ── ROUTE 3: Submit Form ── POST /update-cobj
// Receives form data and creates a new record in HubSpot
app.post('/update-cobj', async (req, res) => {
  const formData = req.body;
  try {
    await axios.post(
      `https://api.hubapi.com/crm/v3/objects/${OBJECT_TYPE}`,
      {
        properties: {
          [PROPERTY_1]: formData[PROPERTY_1],
          [PROPERTY_2]: formData[PROPERTY_2],
          [PROPERTY_3]: formData[PROPERTY_3]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${HUBSPOT_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error.response?.data || error.message);
    res.status(500).send('Error creating record — check your terminal.');
  }
});
