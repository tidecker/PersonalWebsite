import { useState } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
    <Navbar />

    <main className="flex-1">
      <Outlet />
    </main>
    
    <Footer />
    </div>
  )
}

export default App
