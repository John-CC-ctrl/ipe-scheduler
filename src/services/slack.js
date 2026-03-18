import { formatDate, formatTime, getGoogleMapsUrl } from '../utils/formatters';

/**
 * Send IPE submission to Slack via webhook
 */
export async function sendToSlack(formData, timestamp) {
  const webhookUrl = import.meta.env.VITE_SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('VITE_SLACK_WEBHOOK_URL not configured');
    throw new Error('Slack webhook URL not configured');
  }

  const mapsUrl = getGoogleMapsUrl(formData.propertyAddress);

  const payload = {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📅 IPE SCHEDULED — COBALT CLEAN',
          emoji: true,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*📋 LEAD INFORMATION*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${formData.leadName}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${formData.email}`,
          },
          {
            type: 'mrkdwn',
            text: `*Phone:*\n${formData.phone}`,
          },
          {
            type: 'mrkdwn',
            text: `*Recurring Interest:*\n${formData.recurringInterest}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*📍 PROPERTY & APPOINTMENT*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Address:*\n${formData.propertyAddress}`,
          },
          {
            type: 'mrkdwn',
            text: `*Google Maps:*\n<${mapsUrl}|View on Google Maps>`,
          },
          {
            type: 'mrkdwn',
            text: `*Date:*\n${formatDate(formData.ipeDate)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Time:*\n${formatTime(formData.ipeTime)}`,
          },
        ],
      },
      ...(formData.accessInstructions
        ? [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Access Instructions:*\n${formData.accessInstructions}`,
              },
            },
          ]
        : []),
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🧹 ESTIMATE DETAILS*',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Estimator:*\n${formData.estimatorName}`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description of Work:*\n${formData.workDescription}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Pre-Estimate Details:*\n${formData.preEstimateDetails}`,
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `⏱ *Submitted:* ${timestamp}`,
          },
        ],
      },
    ],
  };

  await fetch(webhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  });

  return true;
}
