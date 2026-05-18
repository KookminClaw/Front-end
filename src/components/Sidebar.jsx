import { Link, useLocation } from "react-router-dom";
import { FaCheck, FaDollarSign, FaGraduationCap, FaList, FaStar, FaUser } from "react-icons/fa";
import { MdEdit, MdFlightTakeoff, MdSettings } from "react-icons/md";
import { BiSolidParty } from "react-icons/bi";

const navItem =
  "flex items-center gap-2.5 px-3 py-[9px] rounded-lg cursor-pointer text-sm transition-all duration-150";
const navItemActive = `${navItem} bg-primary-light text-primary font-semibold`;
const navItemInactive = `${navItem} text-subtext hover:bg-surface hover:text-heading`;
const sectionLabel =
  "text-[10px] font-semibold text-subtext tracking-[0.06em] uppercase px-3 pt-2 pb-1 mt-2";

function NavLink({ to, icon, children, badge }) {
  const { pathname } = useLocation();
  const isActive = pathname === to;

  return (
    <Link to={to}>
      <div className={isActive ? navItemActive : navItemInactive}>
        <span className="text-base w-5 flex justify-center">{icon}</span>
        {children}
        {badge && (
          <span className="ml-auto bg-accent text-white text-[10px] font-bold px-1.5 py-px rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-60 bg-white border-r border-line flex flex-col fixed top-0 left-0 bottom-0 z-[100]">
      <div className="px-6 py-5 border-b border-line flex items-center gap-2.5">
        <div className="w-[34px] h-[34px] bg-primary rounded-[10px] flex items-center justify-center text-white text-base">
          <FaGraduationCap />
        </div>
        <div>
          <div className="text-[15px] font-bold text-heading leading-[1.2]">국민클로</div>
          <div className="text-[11px] text-subtext">국민대학교</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <NavLink to="/" icon={<FaList />}>
          공지 목록
        </NavLink>
        <NavLink to="/" icon={<FaStar />}>
          관심 공지
        </NavLink>
        <NavLink to="/" icon={<FaCheck />}>
          To-Do
        </NavLink>

        <div className={sectionLabel}>카테고리</div>
        <NavLink to="/" icon={<FaGraduationCap />}>
          학사 일정
        </NavLink>
        <NavLink to="/" icon={<FaDollarSign />}>
          장학금
        </NavLink>
        <NavLink to="/" icon={<MdFlightTakeoff />}>
          교환학생
        </NavLink>
        <NavLink to="/" icon={<BiSolidParty />}>
          행사 프로그램
        </NavLink>

        <div className={sectionLabel}>설정</div>
        <NavLink to="/profile" icon={<MdSettings />}>
          프로필 설정
        </NavLink>
      </nav>

      <div className="px-5 py-4 border-t border-line flex items-center gap-2.5 cursor-pointer">
        <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-base">
          <FaUser />
        </div>
        <div>
          <div className="text-[13px] font-semibold">소프트웨어학부</div>
          <div className="text-[11px] text-subtext">3학년</div>
        </div>
        <div className="ml-auto text-sm text-subtext">
          <MdEdit />
        </div>
      </div>
    </aside>
  );
}
