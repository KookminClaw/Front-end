import { useState } from "react";

export default function TagInput({ value, onChange, max, suggestions }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)
  );

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !value.includes(trimmed) && value.length < max) {
      onChange([...value, trimmed]);
    }
    setInput("");
    setShowSuggestions(false);
  };

  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 px-2.5 py-2 border border-slate-200 rounded-[10px] bg-white min-h-[42px] cursor-text">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-indigo-50 text-primary rounded-md px-2 py-0.5 text-[13px] font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="bg-transparent border-none cursor-pointer text-primary p-0 leading-none text-sm"
            >
              ×
            </button>
          </span>
        ))}
        {value.length < max && (
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;
              if ((e.key === "Enter" || e.key === ",") && input) { e.preventDefault(); addTag(input); }
              if (e.key === "Backspace" && !input && value.length) removeTag(value[value.length - 1]);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={value.length === 0 ? "입력 후 Enter" : ""}
            className="border-none outline-none flex-1 min-w-[80px] text-[13px] bg-transparent"
          />
        )}
      </div>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-200 rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] mt-1 max-h-[180px] overflow-y-auto">
          {filtered.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={() => addTag(s)}
              className="block w-full text-left px-3 py-2 text-[13px] bg-transparent border-none cursor-pointer text-gray-700 hover:bg-violet-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-1">{value.length}/{max}개</p>
    </div>
  );
}