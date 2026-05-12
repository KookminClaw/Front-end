import { useEffect, useMemo, useState } from "react";
import { FaExternalLinkAlt, FaRedoAlt, FaStar } from "react-icons/fa";
import { getNoticeDetail, getNotices } from "../api/notices";

const badgeBase =
  "inline-flex items-center px-2 py-[3px] rounded-md text-[11px] font-semibold whitespace-nowrap";

const categoryStyle = {
  학사: `${badgeBase} bg-blue-100 text-blue-700`,
  장학: `${badgeBase} bg-amber-100 text-amber-700`,
  비교과: `${badgeBase} bg-emerald-100 text-emerald-700`,
  취업: `${badgeBase} bg-violet-100 text-violet-700`,
  행사: `${badgeBase} bg-rose-100 text-rose-700`,
  기타: `${badgeBase} bg-gray-100 text-gray-600`,
};

const statusBox =
  "bg-white border border-line rounded-[14px] px-6 py-12 text-center text-sm text-subtext";

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getDDay(value) {
  if (!value) return "-";
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "-";

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDeadline = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate()
  );
  const diff = Math.ceil((startOfDeadline - startOfToday) / 86400000);

  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

function isUrgent(value) {
  if (!value) return false;
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return false;
  const diff = Math.ceil((deadline - new Date()) / 86400000);
  return diff >= 0 && diff <= 7;
}

function getCategoryBadge(category) {
  return categoryStyle[category] || categoryStyle.기타;
}

export default function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadNotices = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getNotices();
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "공지 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const summary = useMemo(() => {
    const urgentCount = notices.filter((notice) => isUrgent(notice.deadline)).length;
    const importantCount = notices.filter((notice) => Number(notice.importance) >= 3).length;
    const categoryCount = new Set(notices.map((notice) => notice.category).filter(Boolean)).size;

    return {
      total: notices.length,
      urgentCount,
      importantCount,
      categoryCount,
    };
  }, [notices]);

  const openDetail = async (notice) => {
    setSelectedNotice(notice);
    setDetailLoading(true);
    setDetailError("");

    try {
      const detail = await getNoticeDetail(notice.id);
      setSelectedNotice(detail);
    } catch (err) {
      setDetailError(err.message || "공지 상세를 불러오지 못했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <main className="px-7 py-7 flex-1 flex flex-col gap-6">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-primary border border-primary rounded-[14px] p-5">
          <div className="text-xs text-white mb-2">전체 공지</div>
          <div className="text-[26px] font-bold text-white">{summary.total}</div>
          <div className="text-[11px] text-white mt-1">API에서 불러온 목록</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">마감 임박</div>
          <div className="text-[26px] font-bold text-heading">{summary.urgentCount}</div>
          <div className="text-[11px] text-subtext mt-1">7일 이내 마감</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">중요 공지</div>
          <div className="text-[26px] font-bold text-heading">{summary.importantCount}</div>
          <div className="text-[11px] text-subtext mt-1">importance 3 이상</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">카테고리</div>
          <div className="text-[26px] font-bold text-heading">{summary.categoryCount}</div>
          <div className="text-[11px] text-subtext mt-1">현재 목록 기준</div>
        </div>
      </section>

      <section className="bg-white rounded-[14px] border border-line overflow-hidden">
        <div className="flex items-center px-6 py-4 border-b border-line gap-3">
          <div className="text-[15px] font-bold flex-1">공지 목록</div>
          <button
            type="button"
            onClick={loadNotices}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-[9px] border border-line bg-white text-xs font-semibold text-heading hover:bg-surface"
          >
            <FaRedoAlt />
            새로고침
          </button>
        </div>

        {loading && <div className={statusBox}>공지 목록을 불러오는 중입니다.</div>}

        {!loading && error && (
          <div className={statusBox}>
            <p className="mb-3 text-red-500">{error}</p>
            <button
              type="button"
              onClick={loadNotices}
              className="px-4 py-2 rounded-[9px] bg-primary text-white text-xs font-semibold"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && notices.length === 0 && (
          <div className={statusBox}>표시할 공지가 없습니다.</div>
        )}

        {!loading && !error && notices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line w-10"></th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line min-w-[360px]">
                    공지 제목
                  </th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">
                    출처
                  </th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">
                    카테고리
                  </th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">
                    마감
                  </th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">
                    게시일
                  </th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr
                    key={notice.id}
                    className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light"
                    onClick={() => openDetail(notice)}
                  >
                    <td className="px-5 py-3.5 text-[13px] align-middle text-yellow-300">
                      {Number(notice.importance) >= 3 && <FaStar />}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] align-middle">
                      <div className="flex flex-col gap-[3px]">
                        <span className="font-medium text-heading">{notice.title}</span>
                        <span className="text-[11px] text-subtext">
                          {notice.targetGrade || "전체 대상"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] align-middle text-subtext">
                      {notice.source || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] align-middle">
                      <span className={getCategoryBadge(notice.category)}>
                        {notice.category || "기타"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] align-middle">
                      <span className={isUrgent(notice.deadline) ? categoryStyle.행사 : categoryStyle.기타}>
                        {getDDay(notice.deadline)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">
                      {formatDate(notice.published)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedNotice && (
        <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white shadow-[-4px_0_30px_rgba(0,0,0,0.12)] z-[200] flex flex-col">
          <div className="px-6 py-5 border-b border-line flex items-center gap-3">
            <button
              type="button"
              className="w-8 h-8 rounded-lg border border-line bg-white flex items-center justify-center cursor-pointer text-base shrink-0"
              onClick={() => setSelectedNotice(null)}
            >
              x
            </button>
            <div className="text-base font-bold flex-1 leading-snug">{selectedNotice.title}</div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            {detailLoading && <div className={statusBox}>공지 상세를 불러오는 중입니다.</div>}
            {detailError && <div className={statusBox}>{detailError}</div>}

            {!detailLoading && (
              <>
                <div className="flex flex-wrap gap-2">
                  <span className={getCategoryBadge(selectedNotice.category)}>
                    {selectedNotice.category || "기타"}
                  </span>
                  <span className={categoryStyle.기타}>
                    {selectedNotice.targetGrade || "전체 대상"}
                  </span>
                  <span className={categoryStyle.기타}>
                    마감 {getDDay(selectedNotice.deadline)}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold text-subtext uppercase tracking-[0.06em] mb-2">
                    공지 내용
                  </div>
                  <div className="text-[13px] text-heading leading-[1.7] whitespace-pre-wrap">
                    {selectedNotice.body || "상세 본문이 없습니다."}
                  </div>
                </div>

                <div className="bg-primary-light rounded-xl p-4">
                  <div className="text-xs font-bold text-subtext uppercase tracking-[0.06em] mb-2">
                    AI 요약
                  </div>
                  <div className="text-[13px] text-heading leading-[1.7] whitespace-pre-wrap">
                    {selectedNotice.summary || "요약 정보가 없습니다."}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-line flex gap-2.5">
            <button
              type="button"
              className="flex-1 py-[11px] bg-white text-heading border border-line rounded-[10px] text-sm font-semibold cursor-pointer"
              onClick={() => setSelectedNotice(null)}
            >
              닫기
            </button>
            {selectedNotice.link && (
              <a
                className="flex-1 py-[11px] bg-primary text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer inline-flex items-center justify-center gap-2"
                href={selectedNotice.link}
                target="_blank"
                rel="noreferrer"
              >
                원문 보기
                <FaExternalLinkAlt />
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
