import { useState } from 'react'

const notices = {
  '장학금': {
    title: '2025년 2학기 교내 성적우수 장학금 신청 안내',
    meta: ['장학금', 'D-3 마감', '학생처', '소프트웨어학부 3학년'],
    text: '2025년 2학기 교내 성적우수 장학금 신청을 안내합니다. 직전 학기 성적 3.5 이상, 이수학점 15학점 이상인 학생이 대상이며, 학생처 포털 → 장학금 신청 메뉴에서 신청하실 수 있습니다. 마감은 2025년 8월 31일(일) 23:59입니다.',
    ai: '✅ 마감 D-3입니다. 직전 학기 성적 3.5 이상이면 신청 가능해요. To-Do에 추가해 두는 걸 추천드려요!'
  },
  '캡스톤': {
    title: '2025-2 캡스톤디자인 오리엔테이션 일정 공지',
    meta: ['학사', '내일 오후 2시', '학부사무실', '소프트웨어학부'],
    text: '2025년 2학기 캡스톤디자인 수강 학생을 대상으로 오리엔테이션을 진행합니다. 일시: 2025년 8월 30일(금) 오후 2시, 장소: 공학관 302호.',
    ai: '📅 내일 오후 2시에 공학관 302호에서 열려요. 필수 참석이니 일정 확인하세요!'
  },
  '해커톤': {
    title: '제3회 국민대 AI 해커톤 참가자 모집',
    meta: ['행사', 'D-14', '대외협력처', '전교생'],
    text: '국민대학교 주최 제3회 AI 해커톤 참가자를 모집합니다. 팀 구성(2~4인)으로 참가하며, 최우수팀에게는 총장상 및 상금 200만원이 수여됩니다.',
    ai: '🏆 AI 해커톤 우승 시 총장상 + 상금 200만원! 팀 2~4인으로 지원 가능해요.'
  }
}

const badgeBase = 'inline-flex items-center px-2 py-[3px] rounded-md text-[11px] font-semibold whitespace-nowrap'
const badge = {
  red:    `${badgeBase} bg-red-100 text-red-600`,
  orange: `${badgeBase} bg-amber-100 text-amber-600`,
  blue:   `${badgeBase} bg-blue-100 text-blue-700`,
  green:  `${badgeBase} bg-emerald-100 text-emerald-600`,
  gray:   `${badgeBase} bg-gray-100 text-gray-500`,
  purple: `${badgeBase} bg-violet-100 text-violet-600`,
}

const chip = 'px-3.5 py-1.5 rounded-full border border-line bg-white text-xs font-medium cursor-pointer text-subtext transition-all duration-150 hover:border-primary hover:text-primary'
const chipActive = 'px-3.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer bg-primary border-primary text-white'

export default function NoticePage() {
  const [detail, setDetail] = useState(null)

  return (
    <main className="px-7 py-7 flex-1 flex flex-col gap-6">

      {/* 요약 카드 */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-primary border border-primary rounded-[14px] p-5">
          <div className="text-xs text-white mb-2">오늘 새 공지</div>
          <div className="text-[26px] font-bold text-white">12</div>
          <div className="text-[11px] text-white mt-1">어제보다 3개 ↑</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">마감 임박 (7일 내)</div>
          <div className="text-[26px] font-bold text-heading">3</div>
          <div className="text-[11px] text-subtext mt-1">장학금 1건 포함</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">관심 키워드 매칭</div>
          <div className="text-[26px] font-bold text-heading">5</div>
          <div className="text-[11px] text-subtext mt-1">AI·개발 관련</div>
        </div>
        <div className="bg-white border border-line rounded-[14px] p-5">
          <div className="text-xs text-subtext mb-2">내 학과·학년 공지</div>
          <div className="text-[26px] font-bold text-heading">7</div>
          <div className="text-[11px] text-subtext mt-1">소프트웨어학부 3학년</div>
        </div>
      </div>

      {/* AI 박스 */}
      <div className="bg-gradient-to-br from-primary-light to-[#E8F0FF] border border-[#C7D4FF] rounded-[14px] p-5 px-6 flex gap-4 items-start">
        <div className="w-10 h-10 bg-primary rounded-[10px] flex items-center justify-center text-xl shrink-0">🤖</div>
        <div>
          <div className="text-[11px] font-bold text-primary tracking-[0.05em] uppercase mb-1">AI 맞춤 요약</div>
          <div className="text-[13px] text-heading leading-relaxed">
            이번 주 <strong>장학금 신청 마감(D-3)</strong>이 가장 긴급합니다. 소프트웨어학부 3학년 대상 <strong>캡스톤 설계 오리엔테이션</strong>은 내일 오후 2시 예정이고, 관심 키워드 'AI'로 매칭된 <strong>교내 AI 해커톤</strong> 모집이 시작됐어요.
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <span className="px-2.5 py-1 bg-white border border-[#C7D4FF] rounded-xl text-[11px] font-semibold text-primary cursor-pointer">🎯 장학금 신청하기</span>
            <span className="px-2.5 py-1 bg-white border border-[#C7D4FF] rounded-xl text-[11px] font-semibold text-primary cursor-pointer">📅 캡스톤 일정 확인</span>
            <span className="px-2.5 py-1 bg-white border border-[#C7D4FF] rounded-xl text-[11px] font-semibold text-primary cursor-pointer">🤖 AI 해커톤 지원</span>
          </div>
        </div>
      </div>

      {/* 공지 테이블 */}
      <div className="bg-white rounded-[14px] border border-line overflow-hidden">
        <div className="flex items-center px-6 py-4 border-b border-line gap-3">
          <div className="text-[15px] font-bold flex-1">전체 공지</div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={chipActive}>전체</span>
            <span className={chip}>학사</span>
            <span className={chip}>장학금</span>
            <span className={chip}>취업</span>
            <span className={chip}>교환학생</span>
            <span className={chip}>행사</span>
            <div className="w-px h-5 bg-line"></div>
            <span className={chip}>내 학과</span>
            <span className={chip}>전체 공개</span>
          </div>
          <div className="ml-auto flex gap-2 items-center">
            <div className="flex gap-0.5 bg-surface p-[3px] rounded-[9px] border border-line">
              <div className="px-3 py-[5px] rounded-[7px] text-xs font-semibold cursor-pointer bg-white text-heading shadow-sm">목록</div>
              <div className="px-3 py-[5px] rounded-[7px] text-xs font-medium cursor-pointer text-subtext transition-all duration-150">카드</div>
            </div>
            <div className="text-xs text-primary cursor-pointer font-semibold">정렬 ↓</div>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line w-10"></th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line w-[50%]">공지 제목</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">출처</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">카테고리</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">마감일</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold text-subtext uppercase tracking-[0.05em] bg-gray-50 border-b border-line">날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light" onClick={() => setDetail('장학금')}>
              <td className="px-5 py-3.5 text-[13px] align-middle">⭐</td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">2025년 2학기 교내 성적우수 장학금 신청 안내</span>
                  <span className="text-[11px] text-subtext">소프트웨어학부 · 3학년 대상</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.blue}>학생처</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.orange}>장학금</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.red}>D-3</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.28</td>
            </tr>
            <tr className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light" onClick={() => setDetail('캡스톤')}>
              <td className="px-5 py-3.5 text-[13px] align-middle"></td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">2025-2 캡스톤디자인 오리엔테이션 일정 공지</span>
                  <span className="text-[11px] text-subtext">소프트웨어학부 전체</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.purple}>학부사무실</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.blue}>학사</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.orange}>내일</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.29</td>
            </tr>
            <tr className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light" onClick={() => setDetail('해커톤')}>
              <td className="px-5 py-3.5 text-[13px] align-middle"></td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">제3회 국민대 AI 해커톤 참가자 모집</span>
                  <span className="text-[11px] text-subtext">전교생 · AI, 개발 키워드 매칭</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.green}>대외협력처</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.green}>행사</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.gray}>D-14</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.27</td>
            </tr>
            <tr className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light">
              <td className="px-5 py-3.5 text-[13px] align-middle"></td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">2025 하반기 삼성전자 S/W 개발 인턴십 모집</span>
                  <span className="text-[11px] text-subtext">취업 키워드 매칭</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.gray}>취업지원팀</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.gray}>취업</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.gray}>D-21</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.26</td>
            </tr>
            <tr className="border-b border-line cursor-pointer transition-colors duration-100 hover:bg-primary-light">
              <td className="px-5 py-3.5 text-[13px] align-middle"></td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">2025년 2학기 수강신청 정정 기간 안내</span>
                  <span className="text-[11px] text-subtext">전교생</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.blue}>교무처</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.blue}>학사</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle">—</td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.25</td>
            </tr>
            <tr className="cursor-pointer transition-colors duration-100 hover:bg-primary-light">
              <td className="px-5 py-3.5 text-[13px] align-middle">⭐</td>
              <td className="px-5 py-3.5 text-[13px] align-middle">
                <div className="flex flex-col gap-[3px]">
                  <span className="font-medium text-heading">2026년 상반기 교환학생 모집 설명회</span>
                  <span className="text-[11px] text-subtext">3·4학년 대상</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.green}>국제교류처</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.purple}>교환학생</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle"><span className={badge.gray}>D-30</span></td>
              <td className="px-5 py-3.5 text-[13px] align-middle text-subtext text-xs">2025.08.24</td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-center gap-1 p-4 border-t border-line">
          {['←', '1', '2', '3', '...', '12', '→'].map((p, i) => (
            <div key={i} className={`w-8 h-8 rounded-[7px] border flex items-center justify-center text-[13px] cursor-pointer ${p === '1' ? 'bg-primary text-white border-primary font-bold' : 'bg-white border-line text-subtext'}`}>{p}</div>
          ))}
        </div>
      </div>

      {/* 상세 패널 */}
      {detail && (
        <div className="fixed top-0 right-0 bottom-0 w-[480px] bg-white shadow-[-4px_0_30px_rgba(0,0,0,0.12)] z-[200] flex flex-col">
          <div className="px-6 py-5 border-b border-line flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-line bg-white flex items-center justify-center cursor-pointer text-base shrink-0" onClick={() => setDetail(null)}>✕</div>
            <div className="text-base font-bold flex-1 leading-snug">{notices[detail].title}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              {notices[detail].meta.map((m, i) => (
                <span key={i} className={badge.blue}>{m}</span>
              ))}
            </div>
            <div>
              <div className="text-xs font-bold text-subtext uppercase tracking-[0.06em] mb-2">공지 내용</div>
              <div className="text-[13px] text-heading leading-[1.7]">{notices[detail].text}</div>
            </div>
            <div className="bg-primary-light rounded-xl p-4">
              <div className="text-xs font-bold text-subtext uppercase tracking-[0.06em] mb-2">🤖 AI 요약</div>
              <div className="text-[13px] text-heading leading-[1.7]">{notices[detail].ai}</div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-line flex gap-2.5">
            <button className="flex-1 py-[11px] bg-white text-heading border border-line rounded-[10px] text-sm font-semibold cursor-pointer" onClick={() => setDetail(null)}>닫기</button>
            <button className="flex-1 py-[11px] bg-primary text-white border-none rounded-[10px] text-sm font-semibold cursor-pointer">📌 To-Do 추가</button>
          </div>
        </div>
      )}

    </main>
  )
}
