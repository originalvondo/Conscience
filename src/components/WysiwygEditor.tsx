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
  Heading3 
} from "lucide-react";

import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism.css";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const WysiwygEditor = ({ value, onChange, className }: WysiwygEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageAlignment, setImageAlignment] = useState<"left" | "center" | "right">("center");
  const [imageCaption, setImageCaption] = useState("");

  // Highlight function for Prism
  const highlight = (code: string) => Prism.highlight(code, Prism.languages.markup, 'markup');

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.substring(0, start) + text + value.substring(end);
    
    onChange(newValue);
    
    // Set cursor position after inserted text
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
  const handleCode = () => wrapSelection("<code>", "</code>");
  
  const handleHeading = (level: number) => {
    insertAtCursor(`<h${level}>Heading ${level}</h${level}>\n`);
  };

  const handleCodeBlock = () => {
    insertAtCursor('<pre><code>\n// Your code here\n</code></pre>\n\n');
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

  const handleImageWithText = (side: "left" | "right") => {
    const textHtml = `<div class="flex flex-col md:flex-row gap-6 mb-12 mt-12">\n\t<img \n\t\tsrc="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop" \n\t\talt="Content image" \n\t\tclass="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 md:w-1/2 mb-2 max-w-sm ${side === 'left' ? "md:order-1 md:mr-auto" : "md:order-2 md:ml-auto"}" \n\t/>\n\t<p class="flex-1 md:order-1 md:self-center">\n\t\tYour text content goes here.\n\t</p>\n</div>`;
    insertAtCursor(textHtml);
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCode}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
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

        {/* Code block */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCodeBlock}
          className="h-8 px-2 text-xs"
        >
          Code Block
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Image options */}
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleImageWithText("left")}
          className="h-8 px-2 text-xs"
        >
          <AlignLeft className="h-3 w-3 mr-1" />
          Img+Text
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleImageWithText("right")}
          className="h-8 px-2 text-xs"
        >
          <AlignRight className="h-3 w-3 mr-1" />
          Text+Img
        </Button>
      </div>

      {/* Text Area */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-t-none border-t-0 min-h-[500px] font-mono text-sm resize-none"
        placeholder="Write your article content here. Use the toolbar above to format text and insert images..."
      />

      {/* <Editor
        value={value}
        onValueChange={onChange}
        highlight={highlight}
        padding={10}
        textareaId="wysiwyg-editor"
        placeholder="Write your article content here. Use the toolbar above to format text and insert images..."
        className="rounded-t-none focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 rounded-md border placeholder:text-muted-foreground border-input border-t-0 min-h-[300px] font-mono text-sm bg-background resize-none"
        // style={{ whiteSpace: 'pre-wrap' }}
      /> */}
    </div>
  );
};

export default WysiwygEditor;