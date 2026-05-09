import { MdSettings } from "react-icons/md";
import { FaSearch,FaRegBell } from "react-icons/fa";

export default function Header() {
  return (
    <header className="h-[60px] bg-white border-b border-line flex items-center px-7 gap-4 sticky top-0 z-50">
      <div className="text-lg font-bold flex-1">공지 목록</div>
      <div className="flex items-center gap-2 bg-surface border border-line rounded-lg px-3.5 py-[7px] w-[260px] text-[13px] text-subtext">
        <FaSearch /> <span>공지사항 검색...</span>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg border border-line bg-white flex items-center justify-center text-base cursor-pointer relative">
          <FaRegBell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
        </div>
        <div className="w-9 h-9 rounded-lg border border-line bg-white flex items-center justify-center text-base cursor-pointer"><MdSettings /></div>
      </div>
    </header>
  )
}
