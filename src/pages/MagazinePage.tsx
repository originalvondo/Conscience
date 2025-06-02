import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { error } from "console";

const fetchMagazineBySlug = async (slug) => {
  const apiUrl = `${__API_URL__}/magazines/${slug}/`;
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

const fetchAuthorImgUrl = async (author_slug) => {
  const apiUrl = `${__API_URL__}/authorImage/${author_slug}/`
  try {
    const response = await fetch(apiUrl)
    if(!response.ok) {
      throw new Error(`Failed to fetch Author image URL with username: ${author_slug}`)
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching Author image URL: ", err)
    return null;
  }
}

const MagazinePage = () => {
  const { slug } = useParams();
  const [magazine, setMagazine] = useState(null);
  const [authorImage, setAuthorImage] = useState("")
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

  useEffect(() => {
    const fetchAuthorImage = async () => {
      if (magazine?.author) {
        const authorImgUrl = await fetchAuthorImgUrl(magazine.author);
        setAuthorImage(authorImgUrl);
      }
    };

    fetchAuthorImage();
  }, [magazine]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">{error}</h1>
          <Link to={`${__BASE_URL__}/`}>
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={`${__BASE_URL__}/`} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link to={`${__BASE_URL__}/`} className="text-xl font-bold tracking-tight dark:text-white">
              CONSCIENCE
            </Link>
            <div className="w-24"></div>
            <ThemeToggle />
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
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 dark:text-white">
            {magazine.title}
          </h1>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <img src={`${authorImage}`} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">By <Link to={`${__BASE_URL__}/author/${magazine.author.toLowerCase().replace(' ', '-')}`}>{magazine.author}</Link></p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Contributing Writer</p>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <img
            src={magazine.coverImage}
            alt={magazine.title}
            className="w-full object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none animate-fade-in dark:prose-invert" style={{ animationDelay: '0.4s' }}>
          <p dangerouslySetInnerHTML={{ __html: magazine.about }} className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8" />       
          <div dangerouslySetInnerHTML={{ __html: magazine.content }} />
        </div>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link to={`${__BASE_URL__}/`}>
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
