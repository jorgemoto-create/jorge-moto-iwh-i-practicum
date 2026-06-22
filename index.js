require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const app     = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', './views');
