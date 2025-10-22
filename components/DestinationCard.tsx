import React from 'react';
import type { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
  isSelected: boolean;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onSelect, isSelected }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex items-center ${isSelected ? 'ring-2 ring-[#00A3FF] scale-105' : 'hover:scale-102'}`}
      onClick={() => onSelect(destination)}
    >
      <img 
        src={destination.imageUrl} 
        alt={`View of ${destination.name}`}
        className="w-28 h-28 object-cover flex-shrink-0 bg-sky-100"
      />
      <div className="p-4 flex-grow">
        <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-sky-800 pr-2">{destination.name}</h3>
            <div className="flex-shrink-0 bg-sky-100 text-sky-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {destination.suggestedDays} {destination.suggestedDays > 1 ? 'Days' : 'Day'}
            </div>
        </div>
        <p className="text-sky-700 text-sm mt-1">{destination.description}</p>
      </div>
    </div>
  );
};

export default DestinationCard;