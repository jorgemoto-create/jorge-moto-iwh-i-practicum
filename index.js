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
