import { useState } from 'react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="relative bg-gray-800 p-4">
        
        <div className="flex items-center justify-between">
            <a href="/" className="text-white text-lg font-semibold">My Website</a>
            <button 
            className="md:hidden text-white text-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            >
            {menuOpen ? '✕' : '☰'}
            </button>
        </div>

        <div 
            className={`absolute top-full left-0 right-0 flex flex-col overflow-hidden bg-gray-800 px-4 transition-all duration-300
                    md:static md:flex md:flex-row md:max-h-none md:overflow-visible md:opacity-100 md:px-0 md:pt-2 md:pb-2 md:space-x-4
                    ${
                        menuOpen
                        ? "max-h-96 border-t border-gray-600 pt-4 pb-4 space-y-4 text-lg opacity-100"
                        : "max-h-0 pt-0 pb-0 opacity-0"
                    }
                `}
            >
          <a href="/" className="text-white hover:text-gray-300">Home</a>
          <a href="/about" className="text-white hover:text-gray-300">About</a>
          <a href="/projects" className="text-white hover:text-gray-300">Projects</a>
          <a href="/resume" className="text-white hover:text-gray-300">Resume</a>
          <a href="/hobbies" className="text-white hover:text-gray-300">Hobbies</a>
          <a href="/blog" className="text-white hover:text-gray-300">Blog</a>
          <a href="/contact" className="text-white hover:text-gray-300">Contact</a>
        </div>

    </nav>
  )
}

export default Navbar