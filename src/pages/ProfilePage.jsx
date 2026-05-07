/**
 * ProfilePage.jsx — 3단계 온보딩 프로필 입력/수정 화면
 * 스키마 정의서 v1 (2026-05-07) 기준
 *
 * Step 1. 학적 정보 (필수)  — student_number / grade / department_code / enrollment_status
 * Step 2. 관심·목표 (선택) — interest_keywords / career_goals / course_interests /
 *                             extracurricular_interests / scholarship_interest
 * Step 3. 알림 설정 (선택) — notify_push / notify_email / notify_categories
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronDown, X, Plus, Loader2, CheckCircle, AlertCircle,
  GraduationCap, Compass, Bell, ChevronRight, ChevronLeft,
  BookOpen, Users, Tag,
} from 'lucide-react';
import { useUserProfile, DEFAULT_PROFILE } from '../hooks/useUserProfile';

// ─── 상수 ───────────────────────────────────────────────────
const DEPARTMENTS = [
  { code: 'SW',  name: '소프트웨어학부' },
  { code: 'CS',  name: '컴퓨터공학과' },
  { code: 'AI',  name: '인공지능학과' },
  { code: 'SEC', name: '정보보안학과' },
  { code: 'EE',  name: '전자공학과' },
  { code: 'ME',  name: '기계공학과' },
  { code: 'BIZ', name: '경영학과' },
  { code: 'ECO', name: '경제학과' },
  { code: 'PSY', name: '심리학과' },
  { code: 'KOR', name: '국어국문학과' },
  { code: 'ENG', name: '영어영문학과' },
  { code: 'ETC', name: '기타' },
];
const GRADES = [
  { value: 1, label: '1학년' }, { value: 2, label: '2학년' },
  { value: 3, label: '3학년' }, { value: 4, label: '4학년' },
  { value: 5, label: '졸업유예 / 초과학기' },
];
const ENROLLMENT_STATUSES = [
  { value: 'enrolled',  label: '재학' },
  { value: 'leave',     label: '휴학' },
  { value: 'graduated', label: '졸업' },
];
const KEYWORD_SUGGESTIONS = [
  '인공지능', '머신러닝', '딥러닝', '웹개발', '모바일앱', '백엔드',
  '프론트엔드', '데이터분석', '클라우드', '보안', 'UI/UX', '알고리즘',
  '오픈소스', '스타트업', '논문', '임베디드', 'DevOps', '블록체인',
];
const CAREER_GOAL_OPTIONS = [
  'AI엔지니어', '백엔드개발자', '프론트엔드개발자', '풀스택개발자',
  '데이터사이언티스트', '데이터엔지니어', 'DevOps엔지니어', 'UX디자이너',
  '보안전문가', '연구원', '대학원진학', '스타트업창업', '공무원', '기타',
];
const COURSE_INTEREST_OPTIONS = [
  '머신러닝', '딥러닝', '컴퓨터비전', '자연어처리', '통계학',
  '알고리즘', '운영체제', '데이터베이스', '네트워크', '정보보안',
  '웹프로그래밍', '모바일개발', '클라우드컴퓨팅', '빅데이터',
];
const EXTRACURRICULAR_OPTIONS = [
  '특강', '공모전', '해외연수', '교환학생', '인턴십',
  '학술동아리', '멘토링', '창업지원', '봉사활동', '취업캠프',
];
const NOTIFY_CATEGORY_OPTIONS = ['장학', '과제', '비교과', '취업', '공모전', '학사일정', '특강'];
const STEPS = [
  { id: 1, label: '학적 정보',  icon: GraduationCap, required: true  },
  { id: 2, label: '관심·목표', icon: Compass,        required: false },
  { id: 3, label: '알림 설정', icon: Bell,           required: false },
];

// ─── 서브 컴포넌트 ──────────────────────────────────────────

function SectionHeader({ icon: Icon, title, badge, desc }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0 mt-0.5">
        <Icon size={18} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          {badge && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge === '필수' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
              {badge}
            </span>
          )}
        </div>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

function DeptAutocomplete({ value, onChange, error: hasError }) {
  const [inputVal, setInputVal] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const selectedDept = DEPARTMENTS.find(d => d.code === value);

  useEffect(() => { setInputVal(selectedDept ? selectedDept.name : ''); }, [value]);

  const filtered = DEPARTMENTS.filter(d =>
    d.name.includes(inputVal) || d.code.toLowerCase().includes(inputVal.toLowerCase())
  );

  useEffect(() => {
    const handler = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setInputVal(selectedDept ? selectedDept.name : '');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [selectedDept]);

  return (
    <div ref={wrapRef} className="relative">
      <input
        value={inputVal}
        onChange={e => { setInputVal(e.target.value); setOpen(true); onChange(''); }}
        onFocus={() => setOpen(true)}
        placeholder="학과명 검색 (예: 소프트웨어)"
        autoComplete="off"
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${hasError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.map(dept => (
            <li key={dept.code}>
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(dept.code); setInputVal(dept.name); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center justify-between"
              >
                <span>{dept.name}</span>
                <span className="text-xs text-gray-400 font-mono">{dept.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function KeywordInput({ keywords, onChange, max = 10 }) {
  const [input, setInput] = useState('');
  const add = kw => {
    const t = kw.trim();
    if (t && !keywords.includes(t) && keywords.length < max) onChange([...keywords, t]);
    setInput('');
  };
  const remove = kw => onChange(keywords.filter(k => k !== kw));
  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
    if (e.key === 'Backspace' && input === '' && keywords.length > 0) remove(keywords[keywords.length - 1]);
  };
  return (
    <div className="space-y-3">
      <div className="min-h-[46px] flex flex-wrap gap-1.5 p-2.5 border border-gray-200 rounded-xl bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition">
        {keywords.map(kw => (
          <span key={kw} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
            {kw}
            <button type="button" onClick={() => remove(kw)}><X size={11} /></button>
          </span>
        ))}
        <input
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder={keywords.length === 0 ? '키워드 입력 후 Enter' : ''}
          className="flex-1 min-w-[130px] outline-none text-sm text-gray-700 bg-transparent"
        />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-2">추천 ({keywords.length}/{max}개)</p>
        <div className="flex flex-wrap gap-1.5">
          {KEYWORD_SUGGESTIONS.filter(s => !keywords.includes(s)).map(s => (
            <button key={s} type="button" onClick={() => add(s)} disabled={keywords.length >= max}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Plus size={10} /> {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChipSelect({ options, selected, onChange, max }) {
  const toggle = opt => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const active = selected.includes(opt);
        const disabled = !active && selected.length >= max;
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)} disabled={disabled}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${active ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} aria-label={label}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 ${checked ? 'bg-indigo-500' : 'bg-gray-200'}`}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function StepIndicator({ currentStep, isEditMode, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, idx) => {
        const StepIcon = step.icon;
        const isActive = currentStep === step.id;
        const isDone = currentStep > step.id;
        const isClickable = isEditMode;
        return (
          <div key={step.id} className="flex items-center">
            <button type="button" onClick={() => isClickable && onStepClick(step.id)} disabled={!isClickable}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${isActive ? 'bg-indigo-600 text-white shadow-md' : isDone ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'} ${isClickable && !isActive ? 'hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer' : ''} ${!isClickable ? 'cursor-default' : ''}`}>
              <div className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold`}>
                {isDone ? <CheckCircle size={14} /> : <StepIcon size={13} />}
              </div>
              <span className="hidden sm:block">{step.label}</span>
              <span className="sm:hidden">{step.id}</span>
              {!step.required && (
                <span className={`text-[9px] ${isActive ? 'text-indigo-200' : 'text-gray-400'}`}>선택</span>
              )}
            </button>
            {idx < STEPS.length - 1 && (
              <div className={`w-6 h-0.5 mx-1 rounded ${currentStep > step.id ? 'bg-indigo-300' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-slide-in ${type === 'success' ? 'bg-white border border-green-200 text-green-700' : 'bg-white border border-red-200 text-red-600'}`}>
      {type === 'success' ? <CheckCircle size={17} className="text-green-500" /> : <AlertCircle size={17} className="text-red-500" />}
      {message}
    </div>
  );
}

function CompletionBar({ rate }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500" style={{ width: `${rate}%` }} />
      </div>
      <span className="text-xs text-gray-500 font-medium w-10 text-right">{rate}%</span>
    </div>
  );
}

// ─── 메인 컴포넌트 ──────────────────────────────────────────
export default function ProfilePage() {
  const { profile, loading, saving, error, saveProfile, updateProfile } = useUserProfile();
  const [form, setForm] = useState({ ...DEFAULT_PROFILE });
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!loading && profile) {
      setForm({ ...DEFAULT_PROFILE, ...profile });
      setIsEditMode(true);
    }
  }, [loading, profile]);

  const set = useCallback((key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setFieldErrors(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const validateStep1 = () => {
    const errs = {};
    if (!form.student_number.trim()) errs.student_number = '학번을 입력해주세요';
    else if (!/^\d{7,12}$/.test(form.student_number.trim())) errs.student_number = '학번은 숫자 7~12자리로 입력해주세요';
    if (!form.grade) errs.grade = '학년을 선택해주세요';
    if (!form.department_code) errs.department_code = '학과를 선택해주세요';
    if (!form.enrollment_status) errs.enrollment_status = '재학 상태를 선택해주세요';
    return errs;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length > 0) { setFieldErrors(errs); return; }
    }
    setCurrentStep(s => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const step1Errs = validateStep1();
    if (Object.keys(step1Errs).length > 0) { setFieldErrors(step1Errs); setCurrentStep(1); return; }
    try {
      if (isEditMode) {
        await updateProfile(form);
        setToast({ message: '프로필이 수정되었습니다!', type: 'success' });
      } else {
        await saveProfile(form);
        setIsEditMode(true);
        setToast({ message: '프로필이 저장되었습니다!', type: 'success' });
      }
    } catch { setToast({ message: '저장에 실패했습니다. 다시 시도해주세요.', type: 'error' }); }
  };

  const handleCancel = () => {
    setForm({ ...DEFAULT_PROFILE, ...profile });
    setFieldErrors({});
    setToast({ message: '변경사항이 취소되었습니다', type: 'success' });
  };

  const completionRate = [
    (form.interest_keywords || []).length > 0,
    (form.career_goals || []).length > 0,
    (form.course_interests || []).length > 0,
    (form.extracurricular_interests || []).length > 0,
    Array.isArray(form.notify_categories) && form.notify_categories.length > 0,
  ].filter(Boolean).length * 20;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Loader2 className="animate-spin" size={32} />
          <span className="text-sm">프로필 불러오는 중…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">{isEditMode ? '프로필 수정' : '프로필 설정'}</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditMode ? '정보를 수정하면 개인화 피드가 재최적화됩니다' : '필수 정보만 입력해도 추천을 시작할 수 있어요'}
            </p>
          </div>
          {isEditMode && (
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">선택 항목 완성도</p>
              <CompletionBar rate={completionRate} />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-8 pb-16">
        <StepIndicator currentStep={currentStep} isEditMode={isEditMode} onStepClick={setCurrentStep} />

        {/* STEP 1: 학적 정보 */}
        {currentStep === 1 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <SectionHeader icon={GraduationCap} title="학적 정보" badge="필수" desc="자격 조건 필터링과 Relevance 점수 계산에 사용됩니다" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">학번 <span className="text-red-400">*</span></label>
              <input type="text" inputMode="numeric" value={form.student_number}
                onChange={e => set('student_number', e.target.value)}
                placeholder="예: 20231234" maxLength={12}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${fieldErrors.student_number ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
              />
              {fieldErrors.student_number && <p className="text-xs text-red-500 mt-1">{fieldErrors.student_number}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">학년 <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select value={form.grade} onChange={e => set('grade', Number(e.target.value))}
                    className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${fieldErrors.grade ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">학년 선택</option>
                    {GRADES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {fieldErrors.grade && <p className="text-xs text-red-500 mt-1">{fieldErrors.grade}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">재학 상태 <span className="text-red-400">*</span></label>
                <div className="relative">
                  <select value={form.enrollment_status} onChange={e => set('enrollment_status', e.target.value)}
                    className={`w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${fieldErrors.enrollment_status ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                    {ENROLLMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {fieldErrors.enrollment_status && <p className="text-xs text-red-500 mt-1">{fieldErrors.enrollment_status}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">학과 <span className="text-red-400">*</span></label>
              <DeptAutocomplete value={form.department_code} onChange={v => set('department_code', v)} error={!!fieldErrors.department_code} />
              {fieldErrors.department_code && <p className="text-xs text-red-500 mt-1">{fieldErrors.department_code}</p>}
              {form.department_code && <p className="text-xs text-indigo-500 mt-1">코드: <span className="font-mono font-semibold">{form.department_code}</span></p>}
            </div>
          </section>
        )}

        {/* STEP 2: 관심·목표 */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <SectionHeader icon={Tag} title="관심 키워드" badge="선택" desc="개인화 피드 Interest Match 점수에 사용됩니다 (최대 10개)" />
              <KeywordInput keywords={form.interest_keywords} onChange={v => set('interest_keywords', v)} max={10} />
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <SectionHeader icon={Compass} title="진로 목표" badge="선택" desc="Interest Match 장기 신호 — 최대 5개" />
              <ChipSelect options={CAREER_GOAL_OPTIONS} selected={form.career_goals} onChange={v => set('career_goals', v)} max={5} />
              {form.career_goals.length > 0 && <p className="text-xs text-gray-400 mt-2">{form.career_goals.length}/5개 선택됨</p>}
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <SectionHeader icon={BookOpen} title="수강 관심 분야" badge="선택" desc="특강·스터디 후보 보강에 사용됩니다 (최대 10개)" />
              <ChipSelect options={COURSE_INTEREST_OPTIONS} selected={form.course_interests} onChange={v => set('course_interests', v)} max={10} />
              {form.course_interests.length > 0 && <p className="text-xs text-gray-400 mt-2">{form.course_interests.length}/10개 선택됨</p>}
            </section>
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <SectionHeader icon={Users} title="비교과 활동 관심" badge="선택" desc="비교과 카테고리 가중에 사용됩니다 (최대 10개)" />
              <ChipSelect options={EXTRACURRICULAR_OPTIONS} selected={form.extracurricular_interests} onChange={v => set('extracurricular_interests', v)} max={10} />
              {form.extracurricular_interests.length > 0 && <p className="text-xs text-gray-400 mt-2">{form.extracurricular_interests.length}/10개 선택됨</p>}
              <div className="mt-5 pt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">장학 추천 받기</p>
                  <p className="text-xs text-gray-400 mt-0.5">장학금 관련 콘텐츠를 피드에 포함합니다</p>
                </div>
                <Toggle checked={form.scholarship_interest} onChange={v => set('scholarship_interest', v)} label="장학 추천 받기" />
              </div>
            </section>
          </div>
        )}

        {/* STEP 3: 알림 설정 */}
        {currentStep === 3 && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader icon={Bell} title="알림 설정" badge="선택" desc="액션 계층 리마인더·푸시 정책과 직접 연결됩니다" />
            <div className="space-y-4 mb-6">
              {[
                { key: 'notify_push',  label: '푸시 알림',   desc: '앱 푸시 알림 수신' },
                { key: 'notify_email', label: '이메일 알림', desc: '이메일로 알림 수신' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <Toggle checked={form[key]} onChange={v => set(key, v)} label={label} />
                </div>
              ))}
            </div>
            <div className="pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">알림 받을 카테고리</p>
                  <p className="text-xs text-gray-400 mt-0.5">미선택 시 전체 카테고리 알림</p>
                </div>
                {Array.isArray(form.notify_categories) && form.notify_categories.length > 0 && (
                  <button type="button" onClick={() => set('notify_categories', null)} className="text-xs text-indigo-500 hover:underline">전체 선택</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => set('notify_categories', null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${!Array.isArray(form.notify_categories) || form.notify_categories.length === 0 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-indigo-300'}`}>
                  전체
                </button>
                {NOTIFY_CATEGORY_OPTIONS.map(cat => {
                  const cats = Array.isArray(form.notify_categories) ? form.notify_categories : [];
                  const active = cats.includes(cat);
                  const toggle = () => { const next = active ? cats.filter(c => c !== cat) : [...cats, cat]; set('notify_categories', next.length > 0 ? next : null); };
                  return (
                    <button key={cat} type="button" onClick={toggle}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600'}`}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {error && (
          <div className="flex items-center gap-2 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 ? (
            <button type="button" onClick={handleBack}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              <ChevronLeft size={16} /> 이전
            </button>
          ) : isEditMode ? (
            <button type="button" onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
              변경사항 취소
            </button>
          ) : null}

          {currentStep < 3 ? (
            <button type="button" onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition">
              다음 <ChevronRight size={16} />
              {currentStep === 2 && <span className="text-indigo-300 text-xs ml-1">(선택사항 · 스킵 가능)</span>}
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:scale-[0.98] transition disabled:opacity-60">
              {saving ? <><Loader2 size={16} className="animate-spin" /> 저장 중…</> : isEditMode ? '수정 저장' : '프로필 완성하기'}
            </button>
          )}
        </div>

        {!isEditMode && currentStep < 3 && (
          <p className="text-center text-xs text-gray-400 mt-4">
            {currentStep === 1 && 'Step 1/3 — 필수 항목입니다'}
            {currentStep === 2 && 'Step 2/3 — 작성 시 추천 품질이 크게 올라갑니다'}
          </p>
        )}
      </div>

    </div>
  );
}
