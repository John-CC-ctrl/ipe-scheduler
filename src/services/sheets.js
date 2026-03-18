import { formatDate, formatTime, getGoogleMapsUrl } from '../utils/formatters';

/**
 * Append a row to Google Sheets via a backend endpoint or direct API call
 *
 * Since Google Sheets API requires a service account and server-side auth,
 * this function calls a configured backend endpoint (VITE_SHEETS_ENDPOINT)
 * or falls back gracefully with an error.
 *
 * For production, deploy the included Express/Cloud Function backend
 * that handles the Google Service Account auth server-side.
 */
export async function appendToSheets(formData, timestamp) {
  const sheetsEndpoint = import.meta.env.VITE_SHEETS_ENDPOINT;

  if (!sheetsEndpoint) {
    console.warn('VITE_SHEETS_ENDPOINT not configured');
    throw new Error('Google Sheets endpoint not configured');
  }

  const mapsUrl = getGoogleMapsUrl(formData.propertyAddress);

  const rowData = {
    timestamp,
    leadName: formData.leadName,
    email: formData.email,
    phone: formData.phone,
    recurringInterest: formData.recurringInterest,
    propertyAddress: formData.propertyAddress,
    googleMapsLink: mapsUrl,
    ipeDate: formatDate(formData.ipeDate),
    ipeTime: formatTime(formData.ipeTime),
    accessInstructions: formData.accessInstructions || '',
    estimatorName: formData.estimatorName,
    workDescription: formData.workDescription,
    preEstimateDetails: formData.preEstimateDetails,
  };

  const response = await fetch(sheetsEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rowData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sheets API error: ${response.status} - ${errorText}`);
  }

  return true;
}
