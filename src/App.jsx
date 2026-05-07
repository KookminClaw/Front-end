import './index.css'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import NoticePage from './pages/NoticePage'
import ProfilePage from './pages/ProfilePage'
import ChatbotOverlay from './components/ChatbotOverlay'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)
  const [page, setPage] = useState('notices')

  return (
    <div className="flex min-h-screen bg-surface text-heading">
      <Sidebar currentPage={page} onNavigate={setPage} />
      <div className="ml-60 flex-1 flex flex-col">
        <Header />
        {page === 'notices' && <NoticePage />}
        {page === 'profile' && <ProfilePage />}
      </div>
      <ChatbotOverlay open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
