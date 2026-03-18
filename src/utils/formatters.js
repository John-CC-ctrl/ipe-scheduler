/**
 * Format a date string to a human-readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a time string (HH:MM) to 12-hour format
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

/**
 * Generate a Google Maps search URL from an address
 */
export function getGoogleMapsUrl(address) {
  if (!address || address.trim() === '') return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date = new Date()) {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
}

/**
 * Generate the plain text summary for clipboard
 */
export function generatePlainTextSummary(formData, timestamp) {
  const mapsUrl = getGoogleMapsUrl(formData.propertyAddress);

  return `═══════════════════════════════════════
  IPE SCHEDULED — COBALT CLEAN
═══════════════════════════════════════

📋 LEAD INFO
  Name:        ${formData.leadName}
  Email:       ${formData.email}
  Phone:       ${formData.phone}
  Recurring:   ${formData.recurringInterest}

📍 PROPERTY & APPOINTMENT
  Address:     ${formData.propertyAddress}
  Map:         ${mapsUrl}
  Date:        ${formatDate(formData.ipeDate)}
  Time:        ${formatTime(formData.ipeTime)}
  Access:      ${formData.accessInstructions || 'N/A'}

🧹 ESTIMATE DETAILS
  Estimator:   ${formData.estimatorName}
  Work Desc:   ${formData.workDescription}
  Pre-Est:     ${formData.preEstimateDetails}

⏱ Submitted:   ${timestamp}
═══════════════════════════════════════`;
}
