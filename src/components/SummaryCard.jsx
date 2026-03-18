import { useState } from 'react';
import { formatDate, formatTime, getGoogleMapsUrl, generatePlainTextSummary } from '../utils/formatters';

export function SummaryCard({ formData, timestamp, onNew }) {
  const [copied, setCopied] = useState(false);
  const mapsUrl = getGoogleMapsUrl(formData.propertyAddress);

  const handleCopy = async () => {
    const text = generatePlainTextSummary(formData, timestamp);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="slide-up">
      {/* Success Banner */}
      <div className="mb-6 flex items-center gap-3 bg-emerald-900/40 border border-emerald-700 rounded-xl px-5 py-4">
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-emerald-300">IPE Successfully Scheduled!</p>
          <p className="text-sm text-emerald-400/80">Summary saved below. Slack and Sheets updated.</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-800 border border-slate-600 rounded-2xl overflow-hidden shadow-xl">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-cobalt-800 to-cobalt-700 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">IPE SCHEDULED</h2>
            <p className="text-cobalt-200 text-sm font-medium">Cobalt Clean</p>
          </div>
          <div className="text-3xl">🧹</div>
        </div>

        <div className="p-6 space-y-6">
          {/* Lead Info */}
          <section>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
              <span>📋</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SummaryField label="Name" value={formData.leadName} />
              <SummaryField label="Email" value={formData.email} />
              <SummaryField label="Phone" value={formData.phone} />
              <SummaryField label="Recurring" value={formData.recurringInterest} />
            </div>
          </section>

          {/* Property & Appointment */}
          <section>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
              <span>📍</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property & Appointment</h3>
            </div>
            <div className="space-y-3">
              <SummaryField label="Address" value={formData.propertyAddress} />
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1">Map</span>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cobalt-400 hover:text-cobalt-300 text-sm font-medium underline-offset-2 hover:underline"
                >
                  <span>📍</span>
                  View on Google Maps
                  <span className="text-xs">↗</span>
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SummaryField label="Date" value={formatDate(formData.ipeDate)} />
                <SummaryField label="Time" value={formatTime(formData.ipeTime)} />
              </div>
              {formData.accessInstructions && (
                <SummaryField label="Access Instructions" value={formData.accessInstructions} multiline />
              )}
            </div>
          </section>

          {/* Estimate Details */}
          <section>
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
              <span>🧹</span>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Estimate Details</h3>
            </div>
            <div className="space-y-3">
              <SummaryField label="Estimator" value={formData.estimatorName} />
              <SummaryField label="Work Description" value={formData.workDescription} multiline />
              <SummaryField label="Pre-Estimate Details" value={formData.preEstimateDetails} multiline />
            </div>
          </section>

          {/* Timestamp */}
          <div className="pt-3 border-t border-slate-700">
            <p className="text-xs text-slate-500">
              <span className="font-medium text-slate-400">⏱ Submitted:</span> {timestamp}
            </p>
          </div>
        </div>

        {/* Card Actions */}
        <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
              font-medium text-sm transition-all duration-200
              ${copied
                ? 'bg-emerald-700 text-emerald-100 border border-emerald-600'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600'
              }
            `}
          >
            {copied ? (
              <>
                <span>✅</span>
                Copied to Clipboard!
              </>
            ) : (
              <>
                <span>📋</span>
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={onNew}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg
              font-medium text-sm bg-cobalt-700 hover:bg-cobalt-600 text-white
              border border-cobalt-600 transition-all duration-200"
          >
            <span>➕</span>
            New IPE
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryField({ label, value, multiline }) {
  return (
    <div>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wide block mb-1">{label}</span>
      <p className={`text-sm text-slate-100 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value || '—'}</p>
    </div>
  );
}
