import React, { useState } from "react";
import { Link } from "react-router-dom";
import { saveProfile } from "../api/profiles";

const CAREER_GOAL_OPTIONS = [
  "AI 엔지니어",
  "데이터 분석가",
  "백엔드 개발자",
  "프론트엔드 개발자",
  "대학원 진학",
  "스타트업 창업",
  "공무원",
  "대기업 취업",
  "해외 취업",
  "연구원",
];

const COURSE_INTEREST_OPTIONS = [
  "머신러닝",
  "클라우드",
  "통계",
  "데이터 분석",
  "웹 개발",
  "앱 개발",
  "알고리즘",
  "데이터베이스",
  "네트워크",
  "보안",
];

const EXTRACURRICULAR_OPTIONS = [
  "학회",
  "공모전",
  "해외 연수",
  "인턴십",
  "동아리",
  "멘토링",
  "봉사활동",
];

const NOTIFY_CATEGORY_OPTIONS = ["장학", "과제", "비교과", "취업", "학사공지"];

const DEPARTMENT_OPTIONS = [
  { code: "sw", name: "소프트웨어학부" },
  { code: "ai", name: "인공지능학부" },
  { code: "elec", name: "전기전자공학부" },
  { code: "car", name: "자동차모빌리티학과" },
  { code: "business", name: "경영학부" },
  { code: "design", name: "디자인학부" },
  { code: "law", name: "법학부" },
];

const INITIAL_FORM = {
  student_number: "",
  grade: "",
  department_code: "",
  enrollment_status: "enrolled",
  interest_keywords: [],
  career_goals: [],
  course_interests: [],
  extracurricular_interests: [],
  scholarship_interest: true,
  notify_push: true,
  notify_email: false,
  notify_categories: [],
};

function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-700 m-0">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5 mb-0">{description}</p>}
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

function OptionChips({ options, value, onChange, max }) {
  const toggle = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
      return;
    }
    if (value.length < max) onChange([...value, option]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value.includes(option);
        const disabled = value.length >= max && !selected;

        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => toggle(option)}
            className={[
              "px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150",
              selected
                ? "border border-blue-600 bg-blue-50 text-primary font-semibold"
                : "border border-slate-200 bg-gray-50 text-gray-500 font-normal",
              disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
            ].join(" ")}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function KeywordInput({ value, onChange }) {
  const [input, setInput] = useState("");

  const addKeyword = () => {
    const keyword = input.trim();
    if (!keyword || value.includes(keyword) || value.length >= 10) return;
    onChange([...value, keyword]);
    setInput("");
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addKeyword();
            }
          }}
          placeholder="예: AI"
          className="flex-1 px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm outline-none box-border"
        />
        <button
          type="button"
          onClick={addKeyword}
          className="px-4 py-2.5 rounded-[10px] bg-primary text-white text-sm font-semibold"
        >
          추가
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((keyword) => (
          <button
            key={keyword}
            type="button"
            onClick={() => onChange(value.filter((item) => item !== keyword))}
            className="px-2.5 py-1 rounded-md bg-indigo-50 text-primary text-xs font-semibold"
          >
            {keyword} x
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1">{value.length}/10개</p>
    </div>
  );
}

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const validateStep1 = () => {
    const nextErrors = {};
    if (!form.student_number.trim()) nextErrors.student_number = "학번을 입력해주세요.";
    else if (!/^\d{8}$/.test(form.student_number.trim())) {
      nextErrors.student_number = "학번은 8자리 숫자로 입력해주세요.";
    }
    if (!form.grade) nextErrors.grade = "학년을 선택해주세요.";
    if (!form.department_code) nextErrors.department_code = "학과를 선택해주세요.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((current) => current + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setSubmitError("");

    try {
      await saveProfile(form);
      setSaved(true);
    } catch (error) {
      setSubmitError(
        error.status === 409
          ? "이미 등록된 학번입니다."
          : error.message || "프로필 저장에 실패했습니다."
      );
    } finally {
      setSaving(false);
    }
  };

  const steps = ["학적 정보", "관심 항목", "알림 선호"];

  if (saved) {
    return (
      <main className="p-7 flex justify-center items-center h-full">
        <div className="w-full text-center flex flex-col gap-10 items-center">
          <h2 className="text-2xl font-bold">프로필 저장이 완료되었습니다.</h2>
          <Link
            to="/"
            className="inline-flex items-center justify-center w-44 h-10 rounded-[10px] text-white bg-primary"
          >
            공지 목록으로 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-7">
      <div className="w-full">
        <h1 className="text-xl font-bold mb-6">프로필 설정</h1>

        <div className="flex items-center mb-5">
          {steps.map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const done = step > number;

            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mb-1.5",
                      done || active ? "bg-primary text-white" : "bg-gray-200 text-gray-400",
                    ].join(" ")}
                  >
                    {done ? "✓" : number}
                  </div>
                  <span
                    className={[
                      "text-[11px]",
                      active ? "text-primary font-semibold" : "text-gray-400 font-normal",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={[
                      "h-0.5 flex-[2] mb-[22px] transition-colors duration-300",
                      step > number ? "bg-primary" : "bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 px-8 py-8 mb-5">
          {step === 1 && (
            <div>
              <h2 className="text-base font-bold mb-1">학적 정보</h2>
              <p className="text-[13px] text-gray-400 mb-6">
                추천 시스템의 기본 조건 필터링에 사용됩니다.
              </p>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  학번
                </label>
                <input
                  type="text"
                  value={form.student_number}
                  onChange={(event) => set("student_number", event.target.value)}
                  placeholder="예: 20261234"
                  className={[
                    "w-full px-3 py-2.5 rounded-[10px] border text-sm outline-none box-border",
                    errors.student_number ? "border-red-500" : "border-slate-200",
                  ].join(" ")}
                />
                {errors.student_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.student_number}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  학년
                </label>
                <select
                  value={form.grade}
                  onChange={(event) => set("grade", event.target.value)}
                  className={[
                    "w-full px-3 py-2.5 rounded-[10px] border text-sm outline-none box-border bg-white cursor-pointer",
                    errors.grade ? "border-red-500" : "border-slate-200",
                  ].join(" ")}
                >
                  <option value="">선택해주세요</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                  <option value="5">기타</option>
                </select>
                {errors.grade && <p className="text-xs text-red-500 mt-1">{errors.grade}</p>}
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  학과
                </label>
                <select
                  value={form.department_code}
                  onChange={(event) => set("department_code", event.target.value)}
                  className={[
                    "w-full px-3 py-2.5 rounded-[10px] border text-sm outline-none box-border bg-white cursor-pointer",
                    errors.department_code ? "border-red-500" : "border-slate-200",
                  ].join(" ")}
                >
                  <option value="">선택해주세요</option>
                  {DEPARTMENT_OPTIONS.map((department) => (
                    <option key={department.code} value={department.code}>
                      {department.name}
                    </option>
                  ))}
                </select>
                {errors.department_code && (
                  <p className="text-xs text-red-500 mt-1">{errors.department_code}</p>
                )}
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  재학 상태
                </label>
                <select
                  value={form.enrollment_status}
                  onChange={(event) => set("enrollment_status", event.target.value)}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm outline-none box-border bg-white cursor-pointer"
                >
                  <option value="enrolled">재학</option>
                  <option value="leave">휴학</option>
                  <option value="graduated">졸업</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-base font-bold mb-1">관심 항목</h2>
              <p className="text-[13px] text-gray-400 mb-6">
                입력할수록 추천 결과가 더 잘 맞춰집니다.
              </p>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  관심 키워드
                </label>
                <KeywordInput
                  value={form.interest_keywords}
                  onChange={(value) => set("interest_keywords", value)}
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  진로 목표
                </label>
                <OptionChips
                  options={CAREER_GOAL_OPTIONS}
                  value={form.career_goals}
                  onChange={(value) => set("career_goals", value)}
                  max={5}
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  수강 관심 분야
                </label>
                <OptionChips
                  options={COURSE_INTEREST_OPTIONS}
                  value={form.course_interests}
                  onChange={(value) => set("course_interests", value)}
                  max={10}
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  비교과 관심 분야
                </label>
                <OptionChips
                  options={EXTRACURRICULAR_OPTIONS}
                  value={form.extracurricular_interests}
                  onChange={(value) => set("extracurricular_interests", value)}
                  max={10}
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <Toggle
                  value={form.scholarship_interest}
                  onChange={(value) => set("scholarship_interest", value)}
                  label="장학 추천 받기"
                  description="장학 카테고리 공지를 추천에 포함합니다."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-base font-bold mb-1">알림 선호</h2>
              <p className="text-[13px] text-gray-400 mb-6">
                주요 공지 알림을 받을 방식을 선택해주세요.
              </p>

              <div className="flex flex-col gap-5 mb-6">
                <Toggle
                  value={form.notify_push}
                  onChange={(value) => set("notify_push", value)}
                  label="푸시 알림"
                  description="앱 알림으로 주요 소식을 받습니다."
                />
                <Toggle
                  value={form.notify_email}
                  onChange={(value) => set("notify_email", value)}
                  label="이메일 알림"
                  description="이메일로 주요 소식을 받습니다."
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  알림 받을 카테고리
                </label>
                <div className="flex flex-col gap-2.5 mt-2">
                  {NOTIFY_CATEGORY_OPTIONS.map((category) => {
                    const checked = form.notify_categories.includes(category);
                    return (
                      <label key={category} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? form.notify_categories.filter((item) => item !== category)
                              : [...form.notify_categories, category];
                            set("notify_categories", next);
                          }}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {submitError && (
                <div className="rounded-[10px] bg-red-50 text-red-600 text-sm px-4 py-3">
                  {submitError}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((current) => current - 1)}
              className="px-6 py-3 rounded-[10px] border border-slate-200 bg-white text-gray-700 text-sm font-semibold cursor-pointer"
            >
              이전
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-7 py-3 rounded-[10px] border-none bg-primary text-white text-sm font-semibold cursor-pointer"
            >
              다음
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className={[
                "px-7 py-3 rounded-[10px] border-none text-white text-sm font-semibold",
                saving ? "bg-indigo-300 cursor-not-allowed" : "bg-primary cursor-pointer",
              ].join(" ")}
            >
              {saving ? "저장 중..." : "저장하기"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
