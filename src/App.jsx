import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import NoticePage from './pages/NoticePage'
import ProfilePage from './pages/ProfilePage'
import ChatbotOverlay from './components/ChatbotOverlay'

function Layout() {
  const [chatOpen, setChatOpen] = useState(false)
  const location = useLocation()
  
  return (
    <div className="flex min-h-screen bg-surface text-heading">
        <Sidebar />
        <div className="ml-60 flex-1 flex flex-col">
          <Header />
          <Routes>
            <Route path='/' element={<NoticePage />} />
            <Route path='/profile' element={<ProfilePage />} />
          </Routes>
        </div>
        {location.pathname !== '/profile' && (
          <ChatbotOverlay open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
        )}
      </div>
  )
}

export default function App() {

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
