import React from 'react';
import { MarketNews } from '../types';

interface NewsCardProps {
  news: MarketNews;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-fade-in cursor-pointer hover:bg-gray-700/50 transition-colors duration-200">
      <img className="w-full h-40 object-cover" src={news.imageUrl} alt={news.headline} />
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-2">
            {news.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">{tag}</span>
            ))}
        </div>
        <h3 className="font-bold text-lg mb-2 text-white">{news.headline}</h3>
        <p className="text-gray-300 text-sm mb-4">{news.summary}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{news.source}</span>
          <span>{news.timestamp}</span>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
