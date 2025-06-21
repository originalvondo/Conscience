import { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Menu, X, Link2 } from "lucide-react";
import MagazineCard from "@/components/MagazineCard";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import SpaceScene from "@/components/SpaceScene";
import Logo3D from "@/components/Logo3D";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [magazines, setMagazines] = useState([]);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll position for 3D scene
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
  const allMagazines = magazines.filter(magazine => {
    const matchesSearch = magazine.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      magazine.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      magazine.about.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "ALL" || magazine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  const categories = ["All", "Art", "Culture", "Photography", "Thoughts"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header currentPage="" />

      {/* Hero Section with 3D Background */}
      <section className="relative bg-white dark:bg-gray-800 py-16 px-4 overflow-hidden">
        {/* 3D Space Scene Background */}
        <div className="absolute inset-0 z-0">
          <SpaceScene scrollY={scrollY}/>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-fade-in dark:text-white text-gray-900">
            CONSCIENCE
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
      {featuredMagazines.length > 0 && !searchQuery && selectedCategory === "ALL" && (
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
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Magazine Grid */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in dark:text-white">
            {searchQuery ? `SEARCH RESULTS` : selectedCategory === "ALL" ? "ALL MAGAZINES" : selectedCategory}
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
          {allMagazines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No magazines found matching your criteria.
              </p>
            </div>
          )}
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