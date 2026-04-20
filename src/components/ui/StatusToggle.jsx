export default function StatusToggle({ status, onToggle, disabled = false }) {
  return (
    <div className="flex justify-center items-center">
      <button
        type="button"
        onClick={!disabled ? onToggle : undefined}
        disabled={disabled}
        className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none shadow-inner ${
          status ? 'bg-[#10b981]' : 'bg-slate-200'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div
          className={`absolute top-[2px] left-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            status ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}