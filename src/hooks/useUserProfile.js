/**
 * useUserProfile.js
 * API 추상화 훅 — 스키마 정의서 v1 기준 (2026-05-07)
 * USE_MOCK = false + API_BASE_URL 지정으로 실제 API 전환
 */

import { useState, useEffect, useCallback } from 'react';
import MOCK_SEED from '../mock/mockUserProfile.json';

const USE_MOCK       = true;
const API_BASE_URL   = '/api/v1';
const MOCK_STORAGE_KEY = 'winkaim_user_profile';

export const DEFAULT_PROFILE = {
  user_id: null,
  student_number: '',
  created_at: null,
  updated_at: null,
  profile_completion_rate: 0,
  grade: '',
  department_code: '',
  enrollment_status: 'enrolled',
  interest_keywords: [],
  career_goals: [],
  course_interests: [],
  extracurricular_interests: [],
  scholarship_interest: true,
  notify_push: true,
  notify_email: false,
  notify_categories: null,
};

export function calcCompletionRate(form) {
  const checks = [
    (form.interest_keywords || []).length > 0,
    (form.career_goals || []).length > 0,
    (form.course_interests || []).length > 0,
    (form.extracurricular_interests || []).length > 0,
    Array.isArray(form.notify_categories) && form.notify_categories.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

const mockAdapter = {
  async getProfile() {
    await delay(300);
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : MOCK_SEED;
  },
  async saveProfile(payload) {
    await delay(400);
    const now = new Date().toISOString();
    const existing = localStorage.getItem(MOCK_STORAGE_KEY);
    const prev = existing ? JSON.parse(existing) : {};
    const next = {
      ...DEFAULT_PROFILE, ...prev, ...payload,
      user_id: prev.user_id || `user_${Date.now()}`,
      created_at: prev.created_at || now,
      updated_at: now,
      profile_completion_rate: calcCompletionRate(payload),
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(next));
    return next;
  },
  async updateProfile(payload) {
    await delay(400);
    const now = new Date().toISOString();
    const existing = localStorage.getItem(MOCK_STORAGE_KEY);
    const prev = existing ? JSON.parse(existing) : {};
    const next = {
      ...DEFAULT_PROFILE, ...prev, ...payload,
      updated_at: now,
      profile_completion_rate: calcCompletionRate({ ...prev, ...payload }),
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(next));
    return next;
  },
};

const apiAdapter = {
  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/profile`, { method: 'GET', headers: authHeaders() });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GET /profile failed: ${res.status}`);
    return res.json();
  },
  async saveProfile(payload) {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`POST /profile failed: ${res.status}`);
    return res.json();
  },
  async updateProfile(payload) {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`PATCH /profile failed: ${res.status}`);
    return res.json();
  },
};

const adapter = USE_MOCK ? mockAdapter : apiAdapter;

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await adapter.getProfile(); setProfile(data); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = useCallback(async (formData) => {
    setSaving(true); setError(null);
    try { const saved = await adapter.saveProfile(formData); setProfile(saved); return saved; }
    catch (e) { setError(e.message); throw e; }
    finally { setSaving(false); }
  }, []);

  const updateProfile = useCallback(async (formData) => {
    setSaving(true); setError(null);
    try { const updated = await adapter.updateProfile(formData); setProfile(updated); return updated; }
    catch (e) { setError(e.message); throw e; }
    finally { setSaving(false); }
  }, []);

  return { profile, loading, saving, error, saveProfile, updateProfile, refetch: fetchProfile };
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function authHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
