import './index.css'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import NoticePage from './pages/NoticePage'
import ChatbotOverlay from './components/ChatbotOverlay'

export default function App() {
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-surface text-heading">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col">
        <Header />
        <NoticePage />
      </div>
      <ChatbotOverlay open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
    </div>
  )
}
