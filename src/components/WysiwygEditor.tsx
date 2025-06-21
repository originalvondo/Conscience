import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Link
} from "lucide-react";
interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isExcerpt?: boolean
}

const WysiwygEditor = ({ value, onChange, className, isExcerpt = false }: WysiwygEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isImageTextDialogOpen, setIsImageTextDialogOpen] = useState(false);
  const [isTextImageDialogOpen, setIsTextImageDialogOpen] = useState(false);
  const [isCodeBlockDialogOpen, setIsCodeBlockDialogOpen] = useState(false);
  const [isCodeDialogOpen, setIsCodeDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageAlignment, setImageAlignment] = useState<"left" | "center" | "right">("center");
  const [imageCaption, setImageCaption] = useState("");

  // Image+Text dialog states
  const [imageTextUrl, setImageTextUrl] = useState("");
  const [imageTextAlt, setImageTextAlt] = useState("");
  const [imageTextContent, setImageTextContent] = useState("");

  // Text+Image dialog states
  const [textImageUrl, setTextImageUrl] = useState("");
  const [textImageAlt, setTextImageAlt] = useState("");
  const [textImageContent, setTextImageContent] = useState("");

  // Code block dialog states
  const [codeBlockContent, setCodeBlockContent] = useState("");
  const [codeBlockLanguage, setCodeBlockLanguage] = useState("javascript");

  // Code dialog states
  const [codeContent, setCodeContent] = useState("");

  // Link dialog states
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  const wrapSelection = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    const newText = before + selectedText + after;
    const newValue = value.substring(0, start) + newText + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const handleBold = () => wrapSelection("<strong>", "</strong>");
  const handleItalic = () => wrapSelection("<em>", "</em>");

  const handleHeading = (level: number) => {
    insertAtCursor(`<h${level}>Heading ${level}</h${level}>\n`);
  };

  const handleImageInsert = () => {
    if (!imageUrl) return;

    const alignmentClass = imageAlignment === "left" ? "float-left mr-6 mb-4 max-w-sm"
      : imageAlignment === "right" ? "float-right ml-6 mb-4 max-w-sm"
        : "mx-auto block mt-0 mb-0 max-w-2xl";

    const captionAlignment = imageAlignment === "left" ? "text-left"
      : imageAlignment === "right" ? "text-right"
        : "text-center";

    let imageHtml = `<figure class="animate-fade-in mb-12 mt-12">
  <img src="${imageUrl}" alt="${imageAlt}" class="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${alignmentClass}" />`;

    if (imageCaption) {
      imageHtml += `
  <figcaption class="text-sm text-gray-500 mt-2 italic ${captionAlignment}">${imageCaption}</figcaption>`;
    }

    imageHtml += '\n</figure>\n\n';

    insertAtCursor(imageHtml);

    // Reset form
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setImageAlignment("center");
    setIsImageDialogOpen(false);
  };

  const handleImageTextInsert = () => {
    if (!imageTextUrl || !imageTextContent) return;

    const textHtml = 
    `<div class="flex flex-col md:flex-row gap-6 mb-8">
      <img src="${imageTextUrl}" alt="${imageTextAlt}" class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 md:w-1/2 mb-2 max-w-sm md:order-1 md:mr-auto" />
      <p class="flex-1 md:order-1 md:self-center">${imageTextContent}</p>
    </div>
`;
    insertAtCursor(textHtml);

    setImageTextUrl("");
    setImageTextAlt("");
    setImageTextContent("");
    setIsImageTextDialogOpen(false);
  };

  const handleTextImageInsert = () => {
    if (!textImageUrl || !textImageContent) return;

    const textHtml = `<div class="flex flex-col md:flex-row gap-6 mb-8">
    <p class="flex-1 md:order-1 md:self-center>${textImageContent}</p>
  <img src="${textImageUrl}" alt="${textImageAlt}" class="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 md:w-1/2 mb-2 max-w-sm md:order-2 md:ml-auto" />
</div>

`;
    insertAtCursor(textHtml);

    setTextImageUrl("");
    setTextImageAlt("");
    setTextImageContent("");
    setIsTextImageDialogOpen(false);
  };

  const handleCodeBlockInsert = () => {
    if (!codeBlockContent) return;

    const codeHtml = `<pre><code class="language-${codeBlockLanguage}">
${codeBlockContent}
</code></pre>

`;
    insertAtCursor(codeHtml);

    setCodeBlockContent("");
    setCodeBlockLanguage("javascript");
    setIsCodeBlockDialogOpen(false);
  };

  const handleCodeInsert = () => {
    if (!codeContent) return;

    insertAtCursor(`<code>${codeContent}</code>`);

    setCodeContent("");
    setIsCodeDialogOpen(false);
  };

  const handleLinkInsert = () => {
    if (!linkUrl || !linkText) return;

    insertAtCursor(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`);

    setLinkText("");
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-t-md p-2 bg-gray-50 dark:bg-gray-800 flex flex-wrap gap-1">
        {/* Text formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(1)}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(2)}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleHeading(3)}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="linkText">Link Text</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleLinkInsert} className="w-full">
                Insert Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Code Dialog */}
        <Dialog open={isCodeDialogOpen} onOpenChange={setIsCodeDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Code className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="codeContent">Code</Label>
                <Input
                  id="codeContent"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  placeholder="console.log('Hello');"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleCodeInsert} className="w-full">
                Insert Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Code Block Dialog */}
        <Dialog open={isCodeBlockDialogOpen} onOpenChange={setIsCodeBlockDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              Code Block
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Code Block</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="codeBlockLanguage">Language</Label>
                <Select value={codeBlockLanguage} onValueChange={setCodeBlockLanguage}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="codeBlockContent">Code</Label>
                <Textarea
                  id="codeBlockContent"
                  value={codeBlockContent}
                  onChange={(e) => setCodeBlockContent(e.target.value)}
                  placeholder="// Your code here"
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <Button onClick={handleCodeBlockInsert} className="w-full">
                Insert Code Block
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Image Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageCaption">Caption (optional)</Label>
                <Input
                  id="imageCaption"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Image caption"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Alignment</Label>
                <Select value={imageAlignment} onValueChange={(value: "left" | "center" | "right") => setImageAlignment(value)}>
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

              <Button onClick={handleImageInsert} className="w-full">
                Insert Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image + Text Dialog */}
        <Dialog open={isImageTextDialogOpen} onOpenChange={setIsImageTextDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <AlignLeft className="h-3 w-3 mr-1" />
              Img+Text
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Image + Text</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageTextUrl">Image URL</Label>
                <Input
                  id="imageTextUrl"
                  value={imageTextUrl}
                  onChange={(e) => setImageTextUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageTextAlt">Alt Text</Label>
                <Input
                  id="imageTextAlt"
                  value={imageTextAlt}
                  onChange={(e) => setImageTextAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="imageTextContent">Text Content</Label>
                <Textarea
                  id="imageTextContent"
                  value={imageTextContent}
                  onChange={(e) => setImageTextContent(e.target.value)}
                  placeholder="Your text content goes here..."
                  className="mt-1"
                />
              </div>

              <Button onClick={handleImageTextInsert} className="w-full">
                Insert Image + Text
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Text + Image Dialog */}
        <Dialog open={isTextImageDialogOpen} onOpenChange={setIsTextImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
            >
              <AlignRight className="h-3 w-3 mr-1" />
              Text+Img
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Insert Text + Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="textImageContent">Text Content</Label>
                <Textarea
                  id="textImageContent"
                  value={textImageContent}
                  onChange={(e) => setTextImageContent(e.target.value)}
                  placeholder="Your text content goes here..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="textImageUrl">Image URL</Label>
                <Input
                  id="textImageUrl"
                  value={textImageUrl}
                  onChange={(e) => setTextImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="textImageAlt">Alt Text</Label>
                <Input
                  id="textImageAlt"
                  value={textImageAlt}
                  onChange={(e) => setTextImageAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleTextImageInsert} className="w-full">
                Insert Text + Image
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Simple Textarea Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-t-none border-t-0 ${isExcerpt ? 'min-h-[150px]' : 'min-h-[400px]'} dark:border-2 dark:border-gray-600 resize-none`}
        placeholder={isExcerpt ? "Write a brief excerpt..." : "Write your article content here. Use the toolbar above to format text and insert elements..."}
      />
    </div>
  );
};

export default WysiwygEditor;