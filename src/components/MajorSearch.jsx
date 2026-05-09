import { useState } from "react";

// 학과 코드 및 이름 (데모용)
const majors = [
  { code: "sw", name: "소프트웨어학부" },
  { code: "ai", name: "인공지능학부" },
  { code: "elec", name: "전기전자공학부" },
  { code: "car", name: "자동차모빌리티대학" },
  { code: "business", name: "경영학부" },
  { code: "design", name: "디자인학부" },
  { code: "law", name: "법학부"}
];

export default function MajorSearch({ value, onChange }) {
  const [query, setQuery] = useState(
    majors.find((d) => d.code === value)?.name || ""
  );
  const [open, setOpen] = useState(false);
  const filtered = majors.filter(
    (d) => d.name.includes(query) || d.code.includes(query)
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange(""); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="학과명 검색"
        className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm outline-none box-border"
      />
      {open && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-slate-200 rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.08)] mt-1">
          {filtered.map((d) => (
            <button
              key={d.code}
              type="button"
              onMouseDown={() => { onChange(d.code); setQuery(d.name); setOpen(false); }}
              className="block w-full text-left px-3 py-2.5 text-sm bg-transparent border-none cursor-pointer text-gray-700 hover:bg-violet-50"
            >
              <span className="font-medium">{d.name}</span>
              <span className="text-xs text-gray-400 ml-2">{d.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}