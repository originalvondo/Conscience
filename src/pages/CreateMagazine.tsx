import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentImage from "@/components/ContentImage";

const CreateMagazine = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [contentImages, setContentImages] = useState<Array<{
    id: string;
    src: string;
    alt: string;
    alignment: "left" | "center" | "right";
    caption: string;
  }>>([]);

  const handleAddImage = () => {
    const newImage = {
      id: Date.now().toString(),
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop",
      alt: "Content image",
      alignment: "center" as const,
      caption: "Add your caption here"
    };
    setContentImages([...contentImages, newImage]);
  };

  const handleImageAlignmentChange = (imageId: string, alignment: "left" | "center" | "right") => {
    setContentImages(images => 
      images.map(img => 
        img.id === imageId ? { ...img, alignment } : img
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally save the magazine
    console.log("Magazine created:", { title, excerpt, author, category, content, coverImage, contentImages });
    navigate("/");
  };

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
            <h1 className="text-xl font-bold tracking-tight">Create Magazine</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter magazine title"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of your magazine"
                  required
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Author name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ART">Art</SelectItem>
                      <SelectItem value="CULTURE">Culture</SelectItem>
                      <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="content">Article Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your magazine content here..."
                  required
                  className="mt-1"
                  rows={12}
                />
              </div>

              {/* Content Images */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Content Images</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddImage}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Image</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {contentImages.map((image) => (
                    <div key={image.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <Label>Image URL</Label>
                            <Input
                              value={image.src}
                              onChange={(e) => {
                                setContentImages(images => 
                                  images.map(img => 
                                    img.id === image.id ? { ...img, src: e.target.value } : img
                                  )
                                );
                              }}
                              placeholder="https://example.com/image.jpg"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label>Caption</Label>
                            <Input
                              value={image.caption}
                              onChange={(e) => {
                                setContentImages(images => 
                                  images.map(img => 
                                    img.id === image.id ? { ...img, caption: e.target.value } : img
                                  )
                                );
                              }}
                              placeholder="Image caption"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label>Alignment</Label>
                            <Select 
                              value={image.alignment} 
                              onValueChange={(value: "left" | "center" | "right") => 
                                handleImageAlignmentChange(image.id, value)
                              }
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex flex-col items-center space-y-2">
                          <Label className="text-sm text-gray-500">Preview</Label>
                          <ContentImage
                            src={image.src}
                            alt={image.alt}
                            alignment={image.alignment}
                            caption={image.caption}
                            className="max-w-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Publish Magazine</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMagazine;