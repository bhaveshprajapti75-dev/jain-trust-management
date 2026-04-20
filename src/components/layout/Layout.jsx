import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const mainMargin = sidebarOpen ? 'lg:ml-[250px]' : 'lg:ml-0'

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 overflow-x-hidden">
      {/* ૧. Navbar */}
      <Navbar
        onMenuClick={() => setMobileSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={false} />
      
      
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} isMobile={true} />

      <div className={`transition-all duration-300 ease-in-out flex flex-col flex-1 pt-14 ${mainMargin}`}>
        <main className="p-5 lg:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
