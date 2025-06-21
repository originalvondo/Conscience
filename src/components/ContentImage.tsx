import { cn } from "@/lib/utils";

interface ContentImageProps {
  src: string;
  alt: string;
  alignment: "left" | "center" | "right";
  caption?: string;
  className?: string;
}

const ContentImage = ({ src, alt, alignment, caption, className }: ContentImageProps) => {
  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "float-left mr-6 mb-4 max-w-sm";
      case "right":
        return "float-right ml-6 mb-4 max-w-sm";
      case "center":
      default:
        return "mx-auto block my-8 max-w-2xl";
    }
  };

  const getCaptionClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
      default:
        return "text-center";
    }
  };

  return (
    <figure className={cn("animate-fade-in", className)}>
      <img
        src={src}
        alt={alt}
        className={cn(
          "w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300",
          getAlignmentClasses()
        )}
      />
      {caption && (
        <figcaption className={cn(
          "text-sm text-gray-500 dark:text-gray-400 mt-2 italic",
          getCaptionClasses()
        )}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ContentImage;