import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X, Link2 } from "lucide-react";
import MagazineCard from "@/components/MagazineCard";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 

  const [magazines, setMagazines] = useState([]);
  
  useEffect(() => {
    const apiUrl = `${__API_URL__}/magazines/`;
  
    const fetchMagazines = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setMagazines(data);
      } catch (err) {
        console.error("Failed to fetch magazines:", err);
      }
    };

    fetchMagazines();

    const intervalId = setInterval(fetchMagazines, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  const featuredMagazines = magazines.filter(magazine => magazine.featured);
  const allMagazines = magazines.filter(magazine => 
    magazine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magazine.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    magazine.about.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <a href={`${__BASE_URL__}/`} className="text-2xl font-bold tracking-tight dark:text-white">
              CONSCIENCE
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to={`${__BASE_URL__}/magazines`} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Magazines
              </Link>

              <Link to={`${__BASE_URL__}/authors`} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Authors
              </Link>

              <Link to={`${__BASE_URL__}/magazine/create`} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Create
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
            <ThemeToggle />
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(false)}>
                    Logout
                  </Button>
                  <Button size="sm">
                    <a href={`${__BASE_URL__}/create`}>Create</a>
                  </Button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Link to={`${__BASE_URL__}/`}>Donate to the Project</Link>
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
              <Link to={`${__BASE_URL__}/magazines`} className="block text-gray-600 hover:text-gray-900">
                Magazines
              </Link>
              <Link to={`${__BASE_URL__}/authors`} className="block text-gray-600 hover:text-gray-900">
                Authors
              </Link>
              <Link to={`${__BASE_URL__}/magazine/create`} className="block text-gray-600 hover:text-gray-900">
                Create
              </Link>
              <div className="pt-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => setIsLoggedIn(false)}>
                      Logout
                    </Button>
                    <Button size="sm" className="w-full">
                      <a href={`${__BASE_URL__}/magazine/create`}>Create Magazine</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm">
                      <Link to={`${__BASE_URL__}/`}>Donate to the Project</Link>
                    </Button>
                    <Button size="sm">
                      <Link to={`${__BASE_URL__}/`}>Visit my Website</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-fade-in dark:text-white">
            CONSCIENCE
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            A different perspective.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search magazines, authors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-3 text-base dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </section>

      {/* Featured Section */}
      {featuredMagazines.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in dark:text-white">
              FEATURED
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredMagazines.map((magazine, index) => (
                <MagazineCard 
                  key={magazine.id} 
                  magazine={magazine} 
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button variant="outline" size="sm" className="rounded-full">
              ALL
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              ART
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              CULTURE
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              PHOTOGRAPHY
            </Button>
          </div>
        </div>
      </section>

      {/* Magazine Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in dark:text-white">
            ALL MAGAZINES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allMagazines.map((magazine, index) => (
              <MagazineCard 
                key={magazine.id} 
                magazine={magazine} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-12 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-gray-600">© {new Date().getFullYear()} Conscience Magazine. All rights reserved.</p>
          <div className="text-sm text-gray-500">
            <span>Created by </span>
            <a 
              href="https://originalvondo.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors font-medium"
            >
              Tanvirul Islam
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;