import React, { useState, useRef } from "react";
import TagInput from "../components/InterestTagInput"
import MultiSelect from "../components/chipUi"
import Toggle from "../components/toggle"
import MajorSearch from "../components/MajorSearch"
import {BiSolidParty} from "react-icons/bi"

// 실제 API 연동 시 아래 함수만 교체하면 됩니다.
const MOCK_PROFILE_KEY = "userProfile";

async function mockSaveProfile(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      window._mockUserProfile = data;
      resolve({ success: true, data });
    }, 600);
  });
}

async function mockLoadProfile() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(window._mockUserProfile || null), 300);
  });
}

// 전공 선택에 따라 변경(데모용)
const career_goal_options = [
  "AI엔지니어", "데이터연구가", "백엔드개발자", "프론트엔드개발자",
  "대학원진학", "스타트업창업", "공무원", "대기업취업", "해외취업", "연구원",
];
const COURSE_INTEREST_OPTIONS = [
  "머신러닝", "딥러닝", "통계", "데이터분석", "웹개발", "앱개발",
  "알고리즘", "데이터베이스", "네트워크", "보안",
];
const EXTRACURRICULAR_OPTIONS = [
  "특강", "공모전", "해외연수", "인턴십", "학술제", "동아리", "멘토링", "봉사활동",
];
const NOTIFY_CATEGORY_OPTIONS = ["장학", "과제", "비교과", "취업", "학사공지"];

const KEYWORD_SUGGESTIONS = [
  "AI", "데이터분석", "딥러닝", "클라우드", "알고리즘", "UI/UX",
  "블록체인", "IoT", "자연어처리", "컴퓨터비전",
];

// 폼 초기 상태
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

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validateStep1 = () => {
    const errs = {};
    if (!form.student_number.trim()) errs.student_number = "학번을 입력하세요.";
    else if (!/^\d{8}$/.test(form.student_number.trim())) errs.student_number = "올바른 학번 형식이 아닙니다.";
    if (!form.grade) errs.grade = "학년을 선택하세요.";
    if (!form.department_code) errs.department_code = "학과를 선택하세요.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      student_number: form.student_number.trim(),
      grade: Number(form.grade),
      department_code: form.department_code,
      enrollment_status: form.enrollment_status,
      interest_keywords: form.interest_keywords,
      career_goals: form.career_goals,
      course_interests: form.course_interests,
      extracurricular_interests: form.extracurricular_interests,
      scholarship_interest: form.scholarship_interest,
      notify_push: form.notify_push,
      notify_email: form.notify_email,
      notify_categories: form.notify_categories.length ? form.notify_categories : null,
    };
    await mockSaveProfile(payload);
    setSaving(false);
    setSaved(true);
  };

  const STEPS = ["학적 정보", "관심·목표", "알림 선호"];

  // ── 완료 화면 ──
  if (saved) {
    return (
      <main className="p-7 font-[Pretendard,sans-serif]">
        <div className="max-w-[560px] mx-auto bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4 flex justify-center text-primary"><BiSolidParty /></div>
          <h2 className="text-[22px] font-bold text-primary mb-2">프로필 저장 완료!</h2>
          <p className="text-gray-500 text-sm mb-6">
            저장된 프로필은 개인화 피드 API 요청에 자동으로 사용됩니다.
          </p>
          <div className="bg-[#f8f9ff] rounded-[10px] p-4 text-left mb-6 text-[13px] text-gray-700 leading-relaxed">
            <strong>mock payload (window._mockUserProfile)</strong>
            <br />
            <pre className="text-xs text-primary mt-2 mb-0 overflow-x-auto">
              {JSON.stringify(window._mockUserProfile, null, 2)}
            </pre>
          </div>
          {/* <button
            onClick={() => { setSaved(false); setStep(1); }}
            className="px-6 py-2.5 rounded-[10px] bg-primary text-white border-none cursor-pointer text-sm font-semibold"
          >
            다시 편집하기
          </button> */}
        </div>
      </main>
    );
  }

  return (
    <main className="p-7">
      <div className="w-full">
        {/* 타이틀 */}
        <h1 className="text-xl font-bold mb-6">프로필 설정</h1>

        {/* 단계별 표시 */}
        <div className="flex items-center mb-5">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <React.Fragment key={num}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold mb-1.5",
                      done || active
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-400",
                    ].join(" ")}
                  >
                    {done ? "✓" : num}
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
                {i < STEPS.length - 1 && (
                  <div
                    className={[
                      "h-0.5 flex-[2] mb-[22px] transition-colors duration-300",
                      step > num ? "bg-primary" : "bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl border border-gray-100 px-8 py-8 mb-5">

          {/* 학적 정보 */}
          {step === 1 && (
            <div>
              <h2 className="text-base font-bold mb-1">학적 정보</h2>
              <p className="text-[13px] text-gray-400 mb-6">추천 시스템의 기본 조건 필터링에 사용됩니다. (필수)</p>

              {/* 학번 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">학번</label>
                <input
                  type="text"
                  value={form.student_number}
                  onChange={(e) => set("student_number", e.target.value)}
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

              {/* 학년 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">학년</label>
                <select
                  value={form.grade}
                  onChange={(e) => set("grade", e.target.value)}
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
                {errors.grade && (
                  <p className="text-xs text-red-500 mt-1">{errors.grade}</p>
                )}
              </div>

              {/* 학과 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">학과</label>
                <MajorSearch
                  value={form.department_code}
                  onChange={(code) => set("department_code", code)}
                />
                {errors.department_code && (
                  <p className="text-xs text-red-500 mt-1">{errors.department_code}</p>
                )}
              </div>

              {/* 재학 상태 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">재학 상태</label>
                <select
                  value={form.enrollment_status}
                  onChange={(e) => set("enrollment_status", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[10px] border border-slate-200 text-sm outline-none box-border bg-white cursor-pointer"
                >
                  <option value="enrolled">재학</option>
                  <option value="leave">휴학</option>
                  <option value="graduated">졸업</option>
                </select>
              </div>
            </div>
          )}

          {/* ── STEP 2: 관심·목표 ── */}
          {step === 2 && (
            <div>
              <h2 className="text-base font-bold mb-1">관심·목표</h2>
              <p className="text-[13px] text-gray-400 mb-6">입력할수록 추천 품질이 크게 올라갑니다. 스킵 가능합니다.</p>

              {/* 관심 키워드 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  관심 키워드 <span className="text-gray-400 font-normal">(최대 10개)</span>
                </label>
                <TagInput
                  value={form.interest_keywords}
                  onChange={(v) => set("interest_keywords", v)}
                  max={10}
                  suggestions={KEYWORD_SUGGESTIONS}
                />
              </div>

              {/* 진로 목표 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  진로 목표 <span className="text-gray-400 font-normal">(최대 5개)</span>
                </label>
                <MultiSelect
                  options={career_goal_options}
                  value={form.career_goals}
                  onChange={(v) => set("career_goals", v)}
                  max={5}
                />
              </div>

              {/* 수강 관심 분야 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  수강 관심 분야 <span className="text-gray-400 font-normal">(최대 10개)</span>
                </label>
                <MultiSelect
                  options={COURSE_INTEREST_OPTIONS}
                  value={form.course_interests}
                  onChange={(v) => set("course_interests", v)}
                  max={10}
                />
              </div>

              {/* 비교과 관심 */}
              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  비교과 관심 <span className="text-gray-400 font-normal">(최대 10개)</span>
                </label>
                <MultiSelect
                  options={EXTRACURRICULAR_OPTIONS}
                  value={form.extracurricular_interests}
                  onChange={(v) => set("extracurricular_interests", v)}
                  max={10}
                />
              </div>

              {/* 장학 토글 */}
              <div className="border-t border-gray-100 pt-5">
                <Toggle
                  value={form.scholarship_interest}
                  onChange={(v) => set("scholarship_interest", v)}
                  label="장학 추천 받기"
                  description="장학 카테고리 피드를 추천에 포함합니다."
                />
              </div>
            </div>
          )}

          {/* ── STEP 3: 알림 선호 ── */}
          {step === 3 && (
            <div>
              <h2 className="text-base font-bold mb-1">알림 선호</h2>
              <p className="text-[13px] text-gray-400 mb-6">기본값으로 사용하거나 원하는 설정으로 변경하세요.</p>

              <div className="flex flex-col gap-5 mb-6">
                <Toggle
                  value={form.notify_push}
                  onChange={(v) => set("notify_push", v)}
                  label="푸시 알림"
                  description="앱 알림으로 새 소식을 받습니다."
                />
                <Toggle
                  value={form.notify_email}
                  onChange={(v) => set("notify_email", v)}
                  label="이메일 알림"
                  description="이메일로 주요 소식을 받습니다."
                />
              </div>

              <div className="mb-5">
                <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  알림 받을 카테고리 <span className="text-gray-400 font-normal">(미선택 시 전체)</span>
                </label>
                <div className="flex flex-col gap-2.5 mt-2">
                  {NOTIFY_CATEGORY_OPTIONS.map((cat) => {
                    const checked = form.notify_categories.includes(cat);
                    return (
                      <label key={cat} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const next = checked
                              ? form.notify_categories.filter((c) => c !== cat)
                              : [...form.notify_categories, cat];
                            set("notify_categories", next);
                          }}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm text-gray-700">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
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
              다음 →
            </button>
          ) : (
            <div className="flex gap-2.5 items-center">
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
            </div>
          )}
        </div>

        {/* Step 2, 3 스킵 안내 */}
        {step > 1 && (
          <p className="text-center text-xs text-gray-400 mt-3">
            {step === 2
              ? "관심·목표는 나중에 설정할 수 있어요."
              : "알림 설정은 설정 메뉴에서도 변경할 수 있어요."}
          </p>
        )}
      </div>
    </main>
  );
}