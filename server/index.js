/**
 * IPE Scheduler — Google Sheets Backend Server
 *
 * This Express server handles Google Sheets API calls server-side,
 * keeping the service account credentials secure.
 *
 * Deploy to: Vercel (serverless), Railway, Render, or any Node.js host
 *
 * Required environment variables:
 *   GOOGLE_SHEETS_ID       - The spreadsheet ID from the Google Sheets URL
 *   GOOGLE_SERVICE_ACCOUNT_KEY - JSON string of the service account credentials
 *   PORT                   - (optional) Port to run on, defaults to 3001
 *   ALLOWED_ORIGIN         - (optional) CORS origin, defaults to *
 */

import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Column headers for the Google Sheet
const SHEET_HEADERS = [
  'Timestamp',
  'Lead Name',
  'Email',
  'Phone',
  'Recurring Interest',
  'Property Address',
  'Google Maps Link',
  'IPE Date',
  'IPE Time',
  'Access Instructions',
  'Estimator Name',
  'Work Description',
  'Pre-Estimate Details',
];

async function getAuthClient() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
  }

  const credentials = typeof keyJson === 'string' ? JSON.parse(keyJson) : keyJson;

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return auth.getClient();
}

async function ensureHeaderRow(sheets, spreadsheetId) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Sheet1!A1:M1',
  });

  const rows = response.data.values || [];
  if (rows.length === 0 || rows[0].length === 0) {
    // Write headers
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:M1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [SHEET_HEADERS],
      },
    });
  }
}

app.post('/api/sheets/append', async (req, res) => {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: 'GOOGLE_SHEETS_ID not configured' });
    }

    const {
      timestamp,
      leadName,
      email,
      phone,
      recurringInterest,
      propertyAddress,
      googleMapsLink,
      ipeDate,
      ipeTime,
      accessInstructions,
      estimatorName,
      workDescription,
      preEstimateDetails,
    } = req.body;

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    // Ensure headers exist
    await ensureHeaderRow(sheets, spreadsheetId);

    // Append the data row
    const rowValues = [
      timestamp || new Date().toISOString(),
      leadName || '',
      email || '',
      phone || '',
      recurringInterest || '',
      propertyAddress || '',
      googleMapsLink || '',
      ipeDate || '',
      ipeTime || '',
      accessInstructions || '',
      estimatorName || '',
      workDescription || '',
      preEstimateDetails || '',
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:M',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues],
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Sheets append error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ipe-scheduler-backend' });
});

app.listen(PORT, () => {
  console.log(`IPE Scheduler backend running on port ${PORT}`);
});
