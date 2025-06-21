import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Globe, MapPin } from "lucide-react";
import MagazineCard from "@/components/MagazineCard";
import Footer from "@/components/footer";
import ThemeToggle from "@/components/ThemeToggle";

const AuthorPage = () => {
  const { username } = useParams(); 
  const [authorData, setAuthorData] = useState(null);
  const [authorMagazines, setAuthorMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `${__API_URL__}/author/${username}/`;
        const authorResponse = await fetch(apiUrl);
        const authorJSON = await authorResponse.json();
        const author = authorJSON.author

        if (!author || !author .username) {
          throw new Error("Author not found");
        }

        const magazinesResponse = await fetch(`${__API_URL__}/author/${username}/publications`);
        const magazines = await magazinesResponse.json();

        setAuthorData(author);
        setAuthorMagazines(magazines);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load author data");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading author data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to={`${__BASE_URL__}/`} className="text-gray-600 hover:text-gray-900 transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!authorData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Author not found</h1>
          <Link to={`${__BASE_URL__}/`} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            ← Back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to={`${__BASE_URL__}/`} className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to homepage
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Author Profile Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Image */}
            <div className="flex-shrink-0">
              <img
                src={authorData.image || "https://via.placeholder.com/200"}
                alt={authorData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 dark:border-gray-600"
              />
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                {authorData.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {authorData.bio}
              </p>
              
              {/* Author Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{authorData.totalArticles}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">12k</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Readers</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">2+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {authorData.location || "Unknown"}
                </div>
                <a
                  href={`mailto:${authorData.email}`}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </a>
                <a
                  href={authorData.website}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author's Articles */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in text-gray-900 dark:text-white">
            ARTICLES BY {authorData.name.toUpperCase()}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authorMagazines.map((magazine, index) => (
              <MagazineCard key={magazine.id} index={index} magazine={magazine} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AuthorPage;
