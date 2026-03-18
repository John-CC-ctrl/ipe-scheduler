import { useState } from 'react';
import { FormField, TextInput, TextArea, Select, SectionHeader } from './FormField';
import { getGoogleMapsUrl } from '../utils/formatters';

const INITIAL_FORM = {
  leadName: '',
  email: '',
  phone: '',
  recurringInterest: 'Not Sure Yet',
  propertyAddress: '',
  ipeDate: '',
  ipeTime: '',
  accessInstructions: '',
  estimatorName: '',
  workDescription: '',
  preEstimateDetails: '',
};

const RECURRING_OPTIONS = [
  'One-Time',
  'Weekly',
  'Bi-Weekly',
  'Monthly',
  'Not Sure Yet',
];

function validate(data) {
  const errors = {};
  if (!data.leadName.trim()) errors.leadName = 'Lead name is required';
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  if (!data.propertyAddress.trim()) errors.propertyAddress = 'Property address is required';
  if (!data.ipeDate) errors.ipeDate = 'Appointment date is required';
  if (!data.ipeTime) errors.ipeTime = 'Appointment time is required';
  if (!data.estimatorName.trim()) errors.estimatorName = 'Estimator name is required';
  if (!data.workDescription.trim()) errors.workDescription = 'Work description is required';
  if (!data.preEstimateDetails.trim()) errors.preEstimateDetails = 'Pre-estimate details are required';
  return errors;
}

export function IPEForm({ onSubmit, isSubmitting }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const mapsUrl = getGoogleMapsUrl(form.propertyAddress);

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const blur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate({ ...form });
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrors = validate(form);
    setErrors(allErrors);
    // Mark all as touched
    const allTouched = Object.keys(INITIAL_FORM).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    if (Object.keys(allErrors).length > 0) {
      // Scroll to first error
      const firstErrorEl = document.querySelector('[data-error="true"]');
      if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    onSubmit(form);
  };

  const fieldError = (field) => touched[field] ? errors[field] : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Lead Information */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <SectionHeader icon="📋" title="Lead Information" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Lead Name" required error={fieldError('leadName')}>
            <TextInput
              type="text"
              placeholder="Jane Smith"
              value={form.leadName}
              onChange={set('leadName')}
              onBlur={blur('leadName')}
              error={fieldError('leadName')}
              data-error={!!fieldError('leadName')}
            />
          </FormField>

          <FormField label="Email Address" required error={fieldError('email')}>
            <TextInput
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={set('email')}
              onBlur={blur('email')}
              error={fieldError('email')}
              data-error={!!fieldError('email')}
            />
          </FormField>

          <FormField label="Phone Number" required error={fieldError('phone')}>
            <TextInput
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={set('phone')}
              onBlur={blur('phone')}
              error={fieldError('phone')}
              data-error={!!fieldError('phone')}
            />
          </FormField>

          <FormField label="Recurring Service Interest">
            <Select
              value={form.recurringInterest}
              onChange={set('recurringInterest')}
            >
              {RECURRING_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </FormField>
        </div>
      </div>

      {/* Property & Appointment Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <SectionHeader icon="📍" title="Property & Appointment Details" />
        <div className="space-y-5">
          <FormField
            label="Property Address"
            required
            error={fieldError('propertyAddress')}
            hint="Enter the full address to generate a Google Maps link"
          >
            <TextInput
              type="text"
              placeholder="123 Main St, City, State 12345"
              value={form.propertyAddress}
              onChange={set('propertyAddress')}
              onBlur={blur('propertyAddress')}
              error={fieldError('propertyAddress')}
              data-error={!!fieldError('propertyAddress')}
            />
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg
                  bg-cobalt-800 hover:bg-cobalt-700 border border-cobalt-600 hover:border-cobalt-500
                  text-cobalt-300 hover:text-cobalt-200 text-sm font-medium
                  transition-all duration-200 w-fit"
              >
                <span>📍</span>
                View on Google Maps
                <span className="text-xs opacity-70">↗</span>
              </a>
            )}
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField label="Date of IPE Appointment" required error={fieldError('ipeDate')}>
              <TextInput
                type="date"
                value={form.ipeDate}
                onChange={set('ipeDate')}
                onBlur={blur('ipeDate')}
                error={fieldError('ipeDate')}
                data-error={!!fieldError('ipeDate')}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormField>

            <FormField label="Time of IPE Appointment" required error={fieldError('ipeTime')}>
              <TextInput
                type="time"
                value={form.ipeTime}
                onChange={set('ipeTime')}
                onBlur={blur('ipeTime')}
                error={fieldError('ipeTime')}
                data-error={!!fieldError('ipeTime')}
              />
            </FormField>
          </div>

          <FormField label="Access Instructions">
            <TextArea
              placeholder="Gate code, who to meet, where to park, which entrance, door code, etc."
              value={form.accessInstructions}
              onChange={set('accessInstructions')}
              rows={3}
            />
          </FormField>
        </div>
      </div>

      {/* Estimate Details */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <SectionHeader icon="🧹" title="Estimate Details" />
        <div className="space-y-5">
          <FormField label="In-Person Estimator Name" required error={fieldError('estimatorName')}>
            <TextInput
              type="text"
              placeholder="Team member doing the walkthrough"
              value={form.estimatorName}
              onChange={set('estimatorName')}
              onBlur={blur('estimatorName')}
              error={fieldError('estimatorName')}
              data-error={!!fieldError('estimatorName')}
            />
          </FormField>

          <FormField label="Description of Work" required error={fieldError('workDescription')}>
            <TextArea
              placeholder="e.g., Full deep clean of 3BR/2BA, heavy kitchen grease, baseboards, inside fridge and oven"
              value={form.workDescription}
              onChange={set('workDescription')}
              onBlur={blur('workDescription')}
              error={fieldError('workDescription')}
              data-error={!!fieldError('workDescription')}
              rows={4}
            />
          </FormField>

          <FormField
            label="Pre-Estimate Details"
            required
            error={fieldError('preEstimateDetails')}
          >
            <TextArea
              placeholder="Estimated hours, number of professionals, estimated cost range, any assumptions, etc."
              value={form.preEstimateDetails}
              onChange={set('preEstimateDetails')}
              onBlur={blur('preEstimateDetails')}
              error={fieldError('preEstimateDetails')}
              data-error={!!fieldError('preEstimateDetails')}
              rows={4}
            />
          </FormField>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-base
          flex items-center justify-center gap-3
          transition-all duration-200
          ${isSubmitting
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
            : 'bg-cobalt-700 hover:bg-cobalt-600 active:bg-cobalt-800 text-white border border-cobalt-600 shadow-lg shadow-cobalt-900/50 hover:shadow-cobalt-800/50'
          }
        `}
      >
        {isSubmitting ? (
          <>
            <span className="animate-spin text-xl">⟳</span>
            Scheduling IPE...
          </>
        ) : (
          <>
            <span>📅</span>
            Schedule IPE
          </>
        )}
      </button>
    </form>
  );
}
