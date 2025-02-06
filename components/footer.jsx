import { Github, Twitter, Linkedin,Wind } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const footerSections = [
    {
      title: "Platform",
      links: ["Trading", "Analytics", "Security", "Pricing"]
    },
    {
      title: "Resources",
      links: ["Documentation", "API", "Status", "Blog"]
    },
    {
      title: "Company",
      links: ["About", "Careers", "Press", "Contact"]
    }
  ]

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <span className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-400 flex items-center gap-2">
              <Wind className="h-6 w-6 md:h-8 md:w-8 text-violet-400" />
              Breeze
            </span>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-400">
              Next-generation stock funding platform
            </p>
            <div className="flex space-x-4 mt-4 md:mt-6">
              <Link href="#" className="text-gray-500 hover:text-violet-400 transition-colors">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-violet-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-500 hover:text-violet-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div key={index} className="mt-6 sm:mt-0">
              <h3 className="font-semibold text-gray-300 mb-3 md:mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="text-sm md:text-base text-gray-400 hover:text-violet-400 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 md:mt-12 pt-6 md:pt-8 text-center text-sm md:text-base text-gray-400">
          <p>© {new Date().getFullYear()} Breeze. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

