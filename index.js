const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

function getCompaniesHouseClient() {
  const token = process.env.COMPANIES_HOUSE_API_KEY;
  const encodedToken = Buffer.from(`${token}:`).toString('base64');
  return axios.create({
    baseURL: 'https://api.company-information.service.gov.uk',
    headers: {
      Authorization: `Basic ${encodedToken}`
    }
  });
}

const client = getCompaniesHouseClient();

app.get('/searchCompanies', async (req, res) => {
  const { q } = req.query;
  try {
    const response = await client.get(`/search/companies?q=${encodeURIComponent(q)}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getCompanyByNumber', async (req, res) => {
  const { companyNumber } = req.query;
  try {
    const response = await client.get(`/company/${companyNumber}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/getCompanyOfficers', async (req, res) => {
  const { company_number } = req.query;
  try {
    const response = await client.get(`/company/${company_number}/officers`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
