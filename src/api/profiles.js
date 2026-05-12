import { apiClient } from "./client";

export function toProfileRequest(form) {
  return {
    studentNumber: form.student_number.trim(),
    grade: Number(form.grade),
    departmentCode: form.department_code,
    enrollmentStatus: form.enrollment_status,
    interestKeywords: form.interest_keywords,
    careerGoals: form.career_goals,
    courseInterests: form.course_interests,
    extracurricularInterests: form.extracurricular_interests,
    scholarshipInterest: form.scholarship_interest,
    notifyPush: form.notify_push,
    notifyEmail: form.notify_email,
    notifyCategories: form.notify_categories,
  };
}

export function saveProfile(form) {
  return apiClient("/api/profiles", {
    method: "POST",
    body: JSON.stringify(toProfileRequest(form)),
  });
}
