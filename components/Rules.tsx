import React from 'react';
import { Language, RulesContent } from '../types';

interface RulesProps {
  content: RulesContent;
  isEditable: boolean;
  onUpdateTitle: (val: string) => void;
  onUpdateItem: (index: number, val: string) => void;
}

const Rules: React.FC<RulesProps> = ({ content, isEditable, onUpdateTitle, onUpdateItem }) => {
  return (
    <section id="rules" className="py-20 bg-yassamine-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="text-center mb-12">
           {isEditable ? (
             <input
               type="text"
               value={content.title}
               onChange={(e) => onUpdateTitle(e.target.value)}
               className="text-3xl font-bold text-gray-900 mb-4 bg-transparent border-b-2 border-dashed border-yellow-400 text-center w-full"
             />
           ) : (
             <h2 className="text-3xl font-bold text-gray-900 mb-4">{content.title}</h2>
           )}
           <div className="w-24 h-1 bg-yassamine-gold mx-auto rounded"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
           <ul className="space-y-6">
              {content.items.map((item, index) => (
                 <li key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    {isEditable ? (
                       <textarea
                         value={item}
                         onChange={(e) => onUpdateItem(index, e.target.value)}
                         className="flex-grow text-gray-700 text-lg leading-relaxed border border-dashed border-yellow-400 p-2 rounded h-20 resize-none"
                       />
                    ) : (
                       <p className="text-gray-700 text-lg leading-relaxed">{item}</p>
                    )}
                 </li>
              ))}
           </ul>
        </div>
      </div>
    </section>
  );
};

export default Rules;