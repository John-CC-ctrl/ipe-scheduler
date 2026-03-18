# IPE Scheduler — Cobalt Clean

An internal web app for Cobalt Clean's sales team to book **In-Person Estimates (IPEs)** for high-value or complex cleaning jobs. The app collects lead and property details, generates a formatted summary, and pushes the data to Slack and Google Sheets.

## Features

- **Form** — Collects lead info, property/appointment details, and estimate details
- **Google Maps link** — Auto-generated from the property address, opens directly in Maps
- **Formatted summary card** — Polished confirmation screen after submission
- **Copy to Clipboard** — Copies the full summary as formatted plain text
- **Slack integration** — Posts a Block Kit-formatted message to your Slack channel
- **Google Sheets integration** — Appends a row to a tracking spreadsheet
- **Error handling** — Integrations fail gracefully; the summary always shows
- **Mobile-responsive** — Works on phones and tablets

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS 3
- **Backend** (for Sheets): Node.js + Express (in `/server`)
- **Integrations**: Slack Webhooks, Google Sheets API v4

---

## Setup

### 1. Frontend

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### 2. Environment Variables (Frontend)

Create `.env.local` in the project root:

```env
# Slack — paste your Incoming Webhook URL
VITE_SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Google Sheets — URL of your deployed backend server
VITE_SHEETS_ENDPOINT=https://your-backend.railway.app/api/sheets/append
```

### 3. Backend Server (Google Sheets)

The Google Sheets API requires server-side auth (service account). Run the backend:

```bash
cd server
npm install
# Set env vars (see below), then:
npm start
```

Backend environment variables:

```env
GOOGLE_SHEETS_ID=your-spreadsheet-id-from-url
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
PORT=3001
ALLOWED_ORIGIN=https://your-frontend-domain.vercel.app
```

To get `GOOGLE_SERVICE_ACCOUNT_KEY`:
1. Go to Google Cloud Console → IAM & Admin → Service Accounts
2. Create a service account, give it **Editor** role on the project
3. Create a JSON key and download it
4. Share your Google Sheet with the service account email
5. Copy the entire JSON content as the env var value

---

## Deployment

### Frontend → Vercel

```bash
vercel deploy
```

Set the `VITE_*` environment variables in the Vercel dashboard.

### Backend → Railway / Render

Deploy the `/server` directory. Set `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_KEY`, and `ALLOWED_ORIGIN`.

---

## Slack Webhook Setup

1. Go to [api.slack.com/apps](https://api.slack.com/apps) → Create New App
2. Add **Incoming Webhooks** feature → Activate it
3. Add a new webhook for your target channel
4. Copy the webhook URL into `VITE_SLACK_WEBHOOK_URL`

---

## Google Sheet Columns

The backend writes these columns in order:

| # | Column |
|---|--------|
| 1 | Timestamp |
| 2 | Lead Name |
| 3 | Email |
| 4 | Phone |
| 5 | Recurring Interest |
| 6 | Property Address |
| 7 | Google Maps Link |
| 8 | IPE Date |
| 9 | IPE Time |
| 10 | Access Instructions |
| 11 | Estimator Name |
| 12 | Work Description |
| 13 | Pre-Estimate Details |

Headers are auto-written on the first submission if the sheet is empty.
