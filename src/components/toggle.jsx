export default function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-700 m-0">{label}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5 mb-0">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={[
          "w-11 h-6 rounded-xl border-none cursor-pointer relative transition-colors duration-200 flex-shrink-0",
          value ? "bg-primary" : "bg-gray-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.2)]",
            value ? "left-[22px]" : "left-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}