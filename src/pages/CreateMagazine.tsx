import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WysiwygEditor from "@/components/WysiwygEditor";
import ThemeToggle from "@/components/ThemeToggle";
import { getCsrfToken } from "@/utils/getCsrfToken";
import { useEffect } from "react";


const getCategories = async () => {
  try {
    const response = await fetch(`${__API_URL__}/categories/`);
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    console.log(`received categories: ${data}`);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const CreateMagazine = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // CSRF token state
  const [csrfToken, setCsrfToken] = useState<string>("");
  
  // 1) On mount, fetch CSRF token
  useEffect(() => {
    const fetchData = async () => {
      try {
        const csrfResponse = await fetch(`${__API_URL__}/csrf/`, {
          credentials: "include",
        });
        if (!csrfResponse.ok) throw new Error("Failed to fetch CSRF token");
        const csrfData = await csrfResponse.json();
        setCsrfToken(csrfData.csrfToken);

        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error in fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrfToken) {
      console.error("No CSRF token available");
      return;
    }

    const payload = {
      title, 
      about: excerpt,
      content,
      author,
      category,
      cover_image: coverImage,
      date: new Date().toISOString()
    };

    const res = await fetch(`${__API_URL__}/magazine/create`, {
      method: 'POST',
      credentials: 'include',     
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,  // Django expects this header
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }

    // Here you would normally save the magazine
    const data = await res.json();
    console.log("Magazine created:", data);
    navigate(`${__BASE_URL__}/`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={`${__BASE_URL__}/`} className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Create Article</h1>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className="flex items-center space-x-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {isPreviewMode ? (
                  <>
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </>
                )}
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isPreviewMode ? (
          /* Preview Mode */
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                {title || "Your Magazine Title"}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                By {author || "Author Name"} • {category || "Category"}
              </p>
              {coverImage && (
                <img
                  src={coverImage}
                  alt={title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg mb-8"
                />
              )}
            </div>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-8">
                {excerpt && (
                  <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">About</h3>
                    <div 
                      className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: excerpt }}
                    />
                  </div>
                )}
                
                <div 
                    className="prose dark:prose-invert max-w-none text-gray-900 dark:text-white
                    prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-8 prose-h1:leading-tight
                    prose-h2:text-3xl prose-h2:font-semibold prose-h2:mb-4 prose-h2:mt-6 prose-h2:leading-tight
                    prose-h3:text-2xl prose-h3:font-medium prose-h3:mb-3 prose-h3:mt-4 prose-h3:leading-tight
                    prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4
                    prose-strong:font-bold prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-em:italic prose-em:text-gray-700 dark:prose-em:text-gray-300
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-code:text-sm prose-code:font-mono prose-code:border prose-code:border-gray-200 dark:prose-code:border-gray-700
                    prose-code:text-red-600 dark:prose-code:text-red-400
                    prose-code:before:content-none prose-code:after:content-none
                    prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-gray-700
                    prose-pre:rounded-lg prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:shadow-lg prose-pre:my-6
                    prose-pre:relative prose-pre:before:content-[''] prose-pre:before:absolute prose-pre:before:top-0 prose-pre:before:left-0 prose-pre:before:right-0 prose-pre:before:h-10 prose-pre:before:bg-gray-800 dark:prose-pre:before:bg-gray-900 prose-pre:before:rounded-t-lg prose-pre:before:border-b prose-pre:before:border-gray-600
                    prose-img:rounded-lg prose-img:shadow-md prose-img:max-w-full prose-img:h-auto"
                  dangerouslySetInnerHTML={{ __html: content || "<p>Start writing your article content...</p>" }}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Basic Information */}
            <Card className="animate-fade-in dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter magazine title"
                    required
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-gray-700 dark:text-gray-300">About</Label>
                  <WysiwygEditor
                    value={excerpt}
                    onChange={setExcerpt}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author" className="text-gray-700 dark:text-gray-300">Author username</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name"
                      required
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                        {categories.map((category, index) => (
                          <SelectItem key={index} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="coverImage" className="text-gray-700 dark:text-gray-300">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    required
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="animate-fade-in dark:bg-gray-800 dark:border-gray-700" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="content" className="text-gray-700 dark:text-gray-300">Article Content</Label>
                  <WysiwygEditor
                    value={content}
                    onChange={setContent}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/">
                <Button type="button" variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</Button>
              </Link>
              <Button type="submit" className="dark:bg-blue-600 dark:hover:bg-blue-700">Publish Magazine</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateMagazine;