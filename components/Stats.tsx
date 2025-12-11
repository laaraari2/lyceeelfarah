import React from 'react';
import { Language, SiteContent } from '../types';
import { IconGraduationCap, IconUsers, IconBookOpen, IconGlobe } from './Icons';
import ImageUploader from './ImageUploader';

interface StatsProps {
  language: Language;
  stats: SiteContent['stats'];
  isEditable: boolean;
  onUpdate: (index: number, key: 'value' | 'label' | 'customIcon', val: string) => void;
}

const Stats: React.FC<StatsProps> = ({ language, stats, isEditable, onUpdate }) => {

  // Helper to get icon component based on index, unless custom icon is present
  const getIcon = (index: number, customIcon?: string) => {
    if (customIcon) {
      return <img src={customIcon} alt="Custom Icon" className="w-12 h-12 object-contain" />;
    }

    const icons = [
      <IconGraduationCap className="w-12 h-12" />,
      <IconUsers className="w-12 h-12" />,
      <IconBookOpen className="w-12 h-12" />,
      <IconGlobe className="w-12 h-12" />
    ];
    return icons[index % icons.length];
  };

  // Gradient colors for each stat
  const gradients = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-amber-500 to-orange-500',
    'from-green-500 to-emerald-500'
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-scale-in delay-${index * 100}`}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              {/* Icon */}
              <div className="relative mb-4 flex justify-center">
                {isEditable ? (
                  <div className="relative">
                    <div className={`text-gradient-primary p-4 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} bg-opacity-10 group-hover:scale-110 transition-transform animate-bounce-subtle`}>
                      {getIcon(index, stat.customIcon)}
                    </div>
                    <ImageUploader
                      src=""
                      alt="Upload Icon"
                      onUpload={(base64) => onUpdate(index, 'customIcon', base64)}
                      isEditable={true}
                      className="hidden"
                      containerClassName="absolute inset-0 w-full h-full"
                      overlayText="Edit"
                    />
                  </div>
                ) : (
                  <div className={`p-4 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} bg-opacity-10 group-hover:scale-110 transition-transform animate-bounce-subtle`}>
                    {getIcon(index, stat.customIcon)}
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="relative text-center">
                {isEditable ? (
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => onUpdate(index, 'value', e.target.value)}
                    className="w-full text-4xl font-bold bg-transparent border-b-2 border-dashed border-blue-400 mb-2 text-center"
                  />
                ) : (
                  <div className={`text-5xl font-bold mb-2 bg-gradient-to-r ${gradients[index % gradients.length]} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                )}

                {/* Label */}
                {isEditable ? (
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => onUpdate(index, 'label', e.target.value)}
                    className="w-full bg-transparent text-gray-600 font-medium text-center border-b border-dashed border-gray-400 text-sm"
                  />
                ) : (
                  <p className="text-gray-600 font-medium">
                    {stat.label}
                  </p>
                )}
              </div>

              {/* Decorative Element */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${gradients[index % gradients.length]} rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;