
import React from 'react';
import { Language, NewsContent } from '../types';
import ImageUploader from './ImageUploader';

interface NewsProps {
   content: NewsContent;
   isEditable: boolean;
   onUpdateTitle: (val: string) => void;
   onUpdateItem: (id: number, field: 'title' | 'date' | 'summary' | 'image' | 'videoUrl', val: string) => void;
}

const News: React.FC<NewsProps> = ({ content, isEditable, onUpdateTitle, onUpdateItem }) => {

   const getEmbedUrl = (url: string) => {
      if (!url) return null;
      // Simple check for YouTube
      if (url.includes('youtube.com/watch?v=')) {
         const videoId = url.split('v=')[1]?.split('&')[0];
         return `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes('youtu.be/')) {
         const videoId = url.split('youtu.be/')[1]?.split('?')[0];
         return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return as is if not a recognized format (could be a direct mp4 link in future)
   };

   return (
      <section id="news" className="py-20 bg-gray-50">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               {isEditable ? (
                  <input
                     type="text"
                     value={content.title}
                     onChange={(e) => onUpdateTitle(e.target.value)}
                     className="text-3xl font-bold text-gray-900 mb-4 bg-transparent border-b-2 border-dashed border-yellow-400 text-center w-full md:w-1/3 mx-auto"
                  />
               ) : (
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
               )}
               <div className="w-24 h-1 bg-yassamine-blue mx-auto rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {content.items.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                     <div className="h-48 overflow-hidden relative group">
                        {item.videoUrl ? (
                           <iframe
                              width="100%"
                              height="100%"
                              src={getEmbedUrl(item.videoUrl) || ''}
                              title={item.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full object-cover"
                           ></iframe>
                        ) : (
                           <ImageUploader
                              src={item.image}
                              alt={item.title}
                              onUpload={(base64) => onUpdateItem(item.id, 'image', base64)}
                              isEditable={isEditable}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              containerClassName="w-full h-full"
                           />
                        )}

                        {isEditable && (
                           <div className="absolute top-2 right-2 z-10 bg-white/90 p-1 rounded shadow text-xs">
                              <input
                                 type="text"
                                 placeholder="Video URL (YouTube)"
                                 value={item.videoUrl || ''}
                                 onChange={(e) => onUpdateItem(item.id, 'videoUrl', e.target.value)}
                                 className="border border-gray-300 rounded px-1 w-32 focus:w-48 transition-all"
                              />
                           </div>
                        )}
                     </div>
                     <div className="p-6 flex-grow flex flex-col">
                        <div className="text-xs font-bold text-yassamine-gold mb-2">
                           {isEditable ? (
                              <input
                                 type="text"
                                 value={item.date}
                                 onChange={(e) => onUpdateItem(item.id, 'date', e.target.value)}
                                 className="w-full border-b border-dashed border-gray-300"
                              />
                           ) : item.date}
                        </div>

                        {isEditable ? (
                           <input
                              type="text"
                              value={item.title}
                              onChange={(e) => onUpdateItem(item.id, 'title', e.target.value)}
                              className="text-xl font-bold text-gray-900 mb-3 w-full border-b border-dashed border-gray-300"
                           />
                        ) : (
                           <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        )}

                        {isEditable ? (
                           <textarea
                              value={item.summary}
                              onChange={(e) => onUpdateItem(item.id, 'summary', e.target.value)}
                              className="text-gray-600 text-sm leading-relaxed flex-grow w-full border border-dashed border-gray-300 h-24 resize-none"
                           />
                        ) : (
                           <p className="text-gray-600 text-sm leading-relaxed flex-grow">{item.summary}</p>
                        )}

                        <a href="#" className="mt-4 text-yassamine-blue font-bold text-sm hover:underline inline-block">
                           Read More &rarr;
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default News;