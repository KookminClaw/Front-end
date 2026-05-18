import { apiClient } from "./client";

export function getNotices() {
  return apiClient("/api/notices");
}

export function getNoticeDetail(id) {
  return apiClient(`/api/notices/${id}`);
}
