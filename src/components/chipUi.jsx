export default function MultiSelect({ options, value, onChange, max }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else if (value.length < max) onChange([...value, opt]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = value.includes(opt);
        const disabled = value.length >= max && !selected;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={[
              "px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150",
              selected
                ? "border border-blue-600 bg-blue-50 text-primary font-semibold"
                : "border border-slate-200 bg-gray-50 text-gray-500 font-normal",
              disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}