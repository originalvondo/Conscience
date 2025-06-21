export const processHtmlContent = (content: string): string => {
  // First, handle plain text newlines that aren't already wrapped in HTML tags
  // Split content by HTML tags and process only plain text parts
  const processPlainTextNewlines = (text: string): string => {
    // Split by HTML tags while preserving them
    const parts = text.split(/(<[^>]*>)/);
    
    return parts.map((part, index) => {
      // If this part is an HTML tag, return it as-is
      if (part.startsWith('<') && part.endsWith('>')) {
        return part;
      }
      
      // If this is plain text, convert newlines to <br> tags
      // But only if it's not already inside a block element
      const lines = part.split('\n');
      if (lines.length > 1) {
        return lines
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('<br />');
      }
      
      return part;
    }).join('');
  };

  return processPlainTextNewlines(content);
};