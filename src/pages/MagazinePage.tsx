import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ContentImage from "@/components/ContentImage";
import { useState, useEffect } from "react";

const fetchMagazineBySlug = async (slug) => {
  const apiUrl = `https://conscience.pythonanywhere.com/magazine/${slug}/`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch magazine with ID: ${slug}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching magazine:", err);
    return null; 
  }
};

const MagazinePage = () => {
  const { slug } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      const fetchedMagazine = await fetchMagazineBySlug(slug);
      if (fetchedMagazine) {
        setMagazine(fetchedMagazine);
      } else {
        setError("Magazine not found or failed to fetch."); 
      }
    };

    fetchData();
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link to="/" className="text-xl font-bold tracking-tight">
              CONSCIENCE
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center space-x-4 mb-6">
            <Badge variant="secondary">{magazine.category}</Badge>
            <span className="text-sm text-gray-500">{magazine.date}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{magazine.readTime} read</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            {magazine.title}
          </h1>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">By <Link to={`/author/${magazine.author.toLowerCase().replace(' ', '-')}`}>{magazine.author}</Link></p>
              <p className="text-sm text-gray-500">Contributing Writer</p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {magazine.about}
          </p>
          {/* Additional content here */}
        </div>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Magazine</span>
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default MagazinePage;
