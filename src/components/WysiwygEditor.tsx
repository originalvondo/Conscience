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
                         : "mx-auto block my-8 max-w-2xl";

    const captionAlignment = imageAlignment === "left" ? "text-left"
                           : imageAlignment === "right" ? "text-right"
                           : "text-center";

    let imageHtml = `<figure class="animate-fade-in">
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
    const floatClass = side === "left" ? "float-left mr-6 mb-4 max-w-sm" : "float-right ml-6 mb-4 max-w-sm";
    const textHtml = `<div class="flex flex-col md:flex-row gap-6 mb-8">
  <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop" alt="Content image" class="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${floatClass} md:w-1/2" />
    <p class="flex-1">Your text content goes here. This creates a nice layout with image on the ${side} and text flowing around it.</p>
</div>

`;
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
        className="rounded-t-none border-t-0 min-h-[300px] font-mono text-sm"
        placeholder="Write your article content here. Use the toolbar above to format text and insert images..."
      />
    </div>
  );
};

export default WysiwygEditor;