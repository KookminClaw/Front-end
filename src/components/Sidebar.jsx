const navItem = 'flex items-center gap-2.5 px-3 py-[9px] rounded-lg cursor-pointer text-sm text-subtext transition-all duration-150 hover:bg-surface hover:text-heading'
const navItemActive = 'flex items-center gap-2.5 px-3 py-[9px] rounded-lg cursor-pointer text-sm bg-primary-light text-primary font-semibold transition-all duration-150'
const sectionLabel = 'text-[10px] font-semibold text-subtext tracking-[0.06em] uppercase px-3 pt-2 pb-1 mt-2'

export default function Sidebar({ currentPage, onNavigate }) {
  return (
    <aside className="w-60 bg-white border-r border-line flex flex-col fixed top-0 left-0 bottom-0 z-[100]">
      <div className="px-6 py-5 border-b border-line flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] bg-primary rounded-[10px] flex items-center justify-center text-white text-base">🎓</div>
        <div>
          <div className="text-[15px] font-bold text-heading leading-[1.2]">국민 클로</div>
          <div className="text-[11px] text-subtext">국민대학교</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <div className={currentPage === 'notices' ? navItemActive : navItem} onClick={() => onNavigate('notices')}>
          <span className="text-base w-5 text-center">📋</span> 공지 목록
          <span className="ml-auto bg-accent text-white text-[10px] font-bold px-1.5 py-px rounded-full">3</span>
        </div>
        <div className={navItem}>
          <span className="text-base w-5 text-center">⭐</span> 관심 공지
        </div>
        <div className={navItem}>
          <span className="text-base w-5 text-center">✅</span> 내 To-Do
        </div>

        <div className={sectionLabel}>카테고리</div>
        <div className={navItem}><span className="text-base w-5 text-center">🎓</span> 학사 일정</div>
        <div className={navItem}><span className="text-base w-5 text-center">💰</span> 장학금</div>
        <div className={navItem}><span className="text-base w-5 text-center">💼</span> 취업·인턴</div>
        <div className={navItem}><span className="text-base w-5 text-center">🌍</span> 교환학생</div>
        <div className={navItem}><span className="text-base w-5 text-center">🎉</span> 행사·프로그램</div>

        <div className={sectionLabel}>설정</div>
        <div className={currentPage === 'profile' ? navItemActive : navItem} onClick={() => onNavigate('profile')}>
          <span className="text-base w-5 text-center">⚙️</span> 프로필 설정
        </div>
      </nav>

      <div className="px-5 py-4 border-t border-line flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('profile')}>
        <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-base">👤</div>
        <div>
          <div className="text-[13px] font-semibold">소프트웨어학부</div>
          <div className="text-[11px] text-subtext">3학년</div>
        </div>
        <div className="ml-auto text-sm text-subtext">✏️</div>
      </div>
    </aside>
  )
}
