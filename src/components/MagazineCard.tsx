import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { PassThrough } from "stream";

interface Magazine {
  id: string;
  title: string;
  slug: string;
  about: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  featured?: boolean;
}

interface MagazineCardProps {
  magazine: Magazine;
  index: number;
}

const MagazineCard = ({ magazine, index }: MagazineCardProps) => {
  return (
    <article 
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in group"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        <img
          src={magazine.coverImage}
          alt={magazine.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {magazine.category}
          </Badge>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>{magazine.date}</span>
        </div>
        
        <Link to={`${__BASE_URL__}/magazine/${magazine.slug}/`}>
          <h2 className="text-xl font-bold mb-3 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer dark:text-white">
            {magazine.title}
          </h2>
        </Link>
        
        <p dangerouslySetInnerHTML={{ __html: magazine.about }} className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed" />
                
        <div className="flex items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">By </span>
          <Link 
            to={`${__BASE_URL__}/author/${magazine.author.toLowerCase().replace(' ', '-')}`}
            className="text-sm font-medium text-gray-900 dark:text-white ml-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {magazine.author}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MagazineCard;