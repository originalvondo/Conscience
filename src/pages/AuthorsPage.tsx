import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/footer"

const AuthorsPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const [authorsInfo, setAuthorsInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuthorsInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                const apiUrl = `${__API_URL__}/authors/`;
                const authorsResponse = await fetch(apiUrl);
                const authorsJSON = await authorsResponse.json();

                if (!authorsJSON) {
                    throw new Error("Authors not found");
                }

                // Process authors data
                const processedAuthorsData = authorsJSON.reduce((acc, author) => {
                    acc[author.username] = {
                        name: author.name,
                        username: author.username, // Using username as the unique key
                        image: author.image, 
                        articles: author.articles, // Articles from backend
                        categories: new Set(author.categories), // Categories from backend
                        bio: author.bio || "A passionate writer and creative storyteller.",
                    };
                    return acc;
                }, {});

                setAuthorsInfo(processedAuthorsData);
            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load author data");
            } finally {
                setLoading(false);
            }
        };

        fetchAuthorsInfo();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading authors data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link to={`${__BASE_URL__}`} className="text-gray-600 hover:text-gray-900 transition-colors">
                        ← Back to homepage
                    </Link>
                </div>
            </div>
        );
    }

    if (!authorsInfo) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Authors Found</h1>
                    <Link to={`${__BASE_URL__}`} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        ← Back to homepage
                    </Link>
                </div>
            </div>
        );
    }

    const authors = Object.values(authorsInfo).filter(author =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helper function to get author initials
    const getAuthorInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <Header currentPage="authors" />

            {/* Page Header */}
            <section className="bg-white dark:bg-gray-800 py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 animate-fade-in dark:text-white">
                        AUTHORS
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Meet the talented writers and creators behind our compelling stories and insightful articles.
                    </p>
                </div>
            </section>

            {/* Search Bar */}
            <section className="py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search authors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 py-3 text-base dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                </div>
            </section>

            {/* Authors Grid */}
            <section className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            {authors.length} author{authors.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {authors.map((author, index) => (
                            <Card key={author.name} className="animate-fade-in hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-white dark:bg-gray-800 overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-6 text-center">
                                    {/* Profile Picture - Clickable */}
                                    <Link to={`/author/${author.username}`} className="block mb-4">
                                        <Avatar className="w-24 h-24 mx-auto border-4 border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-colors">
                                            <AvatarImage className="flex" src={author.image} alt={author.name} />
                                            <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                {getAuthorInitials(author.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>

                                    {/* Author Name - Clickable */}
                                    <Link
                                        to={`/author/${author.username}`}
                                        className="block mb-3 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <h3 className="text-xl font-bold dark:text-white">{author.name}</h3>
                                    </Link>

                                    {/* Article Count */}
                                    <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                                        <BookOpen className="h-4 w-4" />
                                        <span className="text-sm">{author.articles.length} article{author.articles.length !== 1 ? 's' : ''}</span>
                                    </div>

                                    {/* Categories */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                                        {Array.from(author.categories).slice(0, 3).map((category) => (
                                            <Badge key={category} variant="secondary" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                {category}
                                            </Badge>
                                        ))}
                                        {author.categories.size > 3 && (
                                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                                +{author.categories.size - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Short Bio */}
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {author.bio}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    {authors.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="h-12 w-12 text-gray-400" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                No authors found matching your search.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AuthorsPage;