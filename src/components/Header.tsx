
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
interface HeaderProps {
  currentPage?: string;
}

const Header = ({ currentPage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActivePage = (page: string) => currentPage === page;

  return (
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href={`${__BASE_URL__}/`} className="text-2xl font-bold tracking-tight dark:text-white">
              CONSCIENCE
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to={`${__BASE_URL__}/magazines`} className={`transition-colors ${
                isActivePage('magazines') 
                  ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white pb-1'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}>
                Magazines
              </Link>

              <Link to={`${__BASE_URL__}/authors`} className={`transition-colors ${
                isActivePage('authors') 
                  ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white pb-1'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}>
                Authors
              </Link>

              <Link to={`${__BASE_URL__}/magazine/create`} className={`transition-colors ${
                isActivePage('create') 
                  ? 'text-gray-900 dark:text-white font-medium border-b-2 border-gray-900 dark:border-white pb-1'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}>
                Create
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
            <ThemeToggle />

              {/* Desktop Auth Buttons */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </Button>
                  <Button size="sm">
                    <a href={`${__BASE_URL__}/create`}>Create</a>
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Link to={`${__BASE_URL__}/donate`}>Donate to the Project</Link>
                  </Button>
                  <Button size="sm">
                    <Link to={`${__BASE_URL__}/`}>Visit my Website</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="px-4 py-3 space-y-3">
              <Link 
                to={`${__BASE_URL__}/magazines`} 
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Magazines
              </Link>

              <Link 
              to={`${__BASE_URL__}/authors`} 
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Authors
              </Link>
              
              <Link 
              to={`${__BASE_URL__}/magazine/create`} 
                className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Create
              </Link>
              
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => {setIsLoggedIn(false); setIsMenuOpen(false)}}>
                      Logout
                    </Button>
                    <Button size="sm" className="w-full">
                      <Link to={`${__BASE_URL__}/magazine/create`} onClick={() => setIsMenuOpen(false)}>Create Magazine</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Link to={`${__BASE_URL__}/donate`} onClick={() => setIsMenuOpen(false)}>Donate to the Project</Link>
                    </Button>
                    <Button size="sm">
                      <Link to={`${__BASE_URL__}/`} onClick={() => setIsMenuOpen(false)}>Visit my Website</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
  );
};

export default Header;