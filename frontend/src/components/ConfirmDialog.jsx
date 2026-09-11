export default function ConfirmDialog({ open, title, description, onConfirm, onCancel, confirmLabel = 'Confirm' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-md bg-white p-5">
        <p className="font-semibold text-stone-900">{title}</p>
        {description && <p className="mt-1 text-sm text-stone-600">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-primary bg-red-600 hover:bg-red-700">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
