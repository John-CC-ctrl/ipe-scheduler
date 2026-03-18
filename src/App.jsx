import { useState, useCallback } from 'react';
import { IPEForm } from './components/IPEForm';
import { SummaryCard } from './components/SummaryCard';
import { ToastContainer, useToasts } from './components/Toast';
import { formatTimestamp } from './utils/formatters';
import { sendToSlack } from './services/slack';
import { appendToSheets } from './services/sheets';

export default function App() {
  const [view, setView] = useState('form'); // 'form' | 'summary'
  const [submittedData, setSubmittedData] = useState(null);
  const [timestamp, setTimestamp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toasts, addToast, removeToast } = useToasts();

  const handleSubmit = useCallback(async (formData) => {
    setIsSubmitting(true);
    const ts = formatTimestamp(new Date());

    try {
      // Run integrations in parallel, don't block on failures
      const [slackResult, sheetsResult] = await Promise.allSettled([
        sendToSlack(formData, ts),
        appendToSheets(formData, ts),
      ]);

      // Show success and switch to summary view
      setSubmittedData(formData);
      setTimestamp(ts);
      setView('summary');

      // Notify about integration results
      if (slackResult.status === 'fulfilled') {
        addToast({
          type: 'success',
          title: 'Slack Updated',
          message: 'IPE details posted to Slack channel.',
          duration: 4000,
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Slack Unavailable',
          message: slackResult.reason?.message || 'Could not post to Slack. Follow up manually.',
          duration: 7000,
        });
      }

      if (sheetsResult.status === 'fulfilled') {
        addToast({
          type: 'success',
          title: 'Google Sheets Updated',
          message: 'Row appended to tracking spreadsheet.',
          duration: 4000,
        });
      } else {
        addToast({
          type: 'warning',
          title: 'Google Sheets Unavailable',
          message: sheetsResult.reason?.message || 'Could not log to Google Sheets. Follow up manually.',
          duration: 7000,
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Submission Error',
        message: err.message || 'An unexpected error occurred.',
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [addToast]);

  const handleNew = useCallback(() => {
    setView('form');
    setSubmittedData(null);
    setTimestamp('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cobalt-700 flex items-center justify-center text-lg shadow-sm">
              🧹
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">IPE Scheduler</h1>
              <p className="text-xs text-slate-400 leading-tight">Cobalt Clean</p>
            </div>
          </div>
          {view === 'summary' && (
            <button
              onClick={handleNew}
              className="ml-auto text-sm text-cobalt-400 hover:text-cobalt-300 font-medium
                flex items-center gap-1.5 transition-colors duration-150"
            >
              <span>➕</span>
              New IPE
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            {view === 'form' ? 'Schedule In-Person Estimate' : 'IPE Confirmation'}
          </h2>
          <p className="text-slate-400 text-sm">
            {view === 'form'
              ? 'Fill in the details below to book an in-person estimate walkthrough.'
              : 'Your IPE has been scheduled. Review the details below.'}
          </p>
        </div>

        {view === 'form' ? (
          <IPEForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        ) : (
          <SummaryCard
            formData={submittedData}
            timestamp={timestamp}
            onNew={handleNew}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-2xl mx-auto px-4 py-6 mt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-600">
          Cobalt Clean · IPE Scheduler · Internal Operations Tool
        </p>
      </footer>
    </div>
  );
}
