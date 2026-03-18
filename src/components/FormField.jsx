export function FormField({ label, required, error, children, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-300">
        {label}
        {required && <span className="text-cobalt-400 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-3 py-2.5 rounded-lg text-sm
        bg-slate-800 border text-slate-100 placeholder-slate-500
        focus:ring-2 focus:ring-cobalt-500 focus:border-cobalt-500
        ${error ? 'border-red-500' : 'border-slate-600'}
        ${className}
      `}
      {...props}
    />
  );
}

export function TextArea({ error, className = '', ...props }) {
  return (
    <textarea
      rows={3}
      className={`
        w-full px-3 py-2.5 rounded-lg text-sm
        bg-slate-800 border text-slate-100 placeholder-slate-500
        focus:ring-2 focus:ring-cobalt-500 focus:border-cobalt-500
        resize-y min-h-[80px]
        ${error ? 'border-red-500' : 'border-slate-600'}
        ${className}
      `}
      {...props}
    />
  );
}

export function Select({ error, children, className = '', ...props }) {
  return (
    <select
      className={`
        w-full px-3 py-2.5 rounded-lg text-sm
        bg-slate-800 border text-slate-100
        focus:ring-2 focus:ring-cobalt-500 focus:border-cobalt-500
        ${error ? 'border-red-500' : 'border-slate-600'}
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}

export function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-700">
      <span className="text-xl">{icon}</span>
      <h2 className="text-base font-semibold text-slate-200 tracking-wide uppercase">
        {title}
      </h2>
    </div>
  );
}
