import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import { Outlet } from 'react-router'

{/* Here defines the main structure of the application. 
  It states what is the layout of each page ie. the header, main content, and footer */ }
function App() {

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
