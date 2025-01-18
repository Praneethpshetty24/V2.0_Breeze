import Link from 'next/link';
import { FaWind } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2 text-2xl font-bold">
            <FaWind className="text-3xl text-purple-500" />
            <span className="bg-gradient-to-r from-purple-500 to-[#00ff7f] text-transparent bg-clip-text">
              Breeze
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              href="/home" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

