import React from 'react';
import type { Destination, DestinationDetails, DailyPlan } from '../types';
import { ItineraryIcon } from './icons/ItineraryIcon';
import { DirectionsIcon } from './icons/DirectionsIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { SuitcaseIcon } from './icons/SuitcaseIcon';
import { FilmIcon } from './icons/FilmIcon';

interface DestinationDetailModalProps {
  destination: Destination;
  details: DestinationDetails | null;
  isLoading: boolean;
  onClose: () => void;
}

const DailyPlanCard: React.FC<{ plan: DailyPlan }> = ({ plan }) => (
    <div className="mt-4 border border-sky-100 rounded-lg p-4 bg-sky-50/50">
        <h4 className="text-md font-bold text-[#0077b6]">Day {plan.day}: {plan.title}</h4>
        <ul className="mt-2 space-y-2">
            {plan.activities.map((activity, index) => (
                <li key={index} className="pl-4 border-l-2 border-sky-200">
                    <p className="font-semibold text-sky-800">{activity.name}</p>
                    <p className="text-sm text-sky-700">{activity.description}</p>
                </li>
            ))}
        </ul>
    </div>
);

const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({ destination, details, isLoading, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-transform duration-300 ease-out animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
            <img src={destination.imageUrl} alt={destination.name} className="w-full h-48 object-cover rounded-t-xl bg-sky-200" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h2 className="text-3xl font-bold text-white shadow-lg">{destination.name}</h2>
                <p className="text-white/90 mt-1">A suggested {destination.suggestedDays}-day plan</p>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
              <XCircleIcon className="h-8 w-8" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center items-center py-10">
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-sky-200 h-10 w-10 animate-spin border-t-[#00A3FF]"></div>
                <p className="ml-4 text-sky-700">Curating your {destination.suggestedDays}-day itinerary...</p>
              </div>
            )}
            {!isLoading && details && (
              <div className="space-y-6">
                <section>
                    <div className="flex items-center mb-2">
                        <ItineraryIcon className="h-6 w-6 text-[#00A3FF]"/>
                        <h3 className="text-xl font-semibold text-sky-800 ml-2">Daily Itinerary</h3>
                    </div>
                    <div className="space-y-4">
                        {details.dailyPlans.map((plan) => <DailyPlanCard key={plan.day} plan={plan} />)}
                    </div>
                </section>

                <section className="pt-4 border-t border-sky-100">
                    <div className="flex items-center mb-2">
                        <SuitcaseIcon className="h-6 w-6 text-green-500"/>
                        <h3 className="text-xl font-semibold text-sky-800 ml-2">Packing & Tips</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className='bg-green-50 p-3 rounded-lg'>
                            <h4 className='font-bold text-green-800 mb-1'>What to Pack</h4>
                            <ul className='list-disc list-inside text-green-700 space-y-1'>
                                {details.packingAndTips.packingList.map(item => <li key={item}>{item}</li>)}
                            </ul>
                        </div>
                        <div className='bg-green-50 p-3 rounded-lg'>
                             <h4 className='font-bold text-green-800 mb-1'>Travel Tips</h4>
                            <ul className='list-disc list-inside text-green-700 space-y-1'>
                                {details.packingAndTips.travelTips.map(tip => <li key={tip}>{tip}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="pt-4 border-t border-sky-100">
                    <div className="flex items-center mb-2">
                        <FilmIcon className="h-6 w-6 text-red-500"/>
                        <h3 className="text-xl font-semibold text-sky-800 ml-2">Entertainment For Your Trip</h3>
                    </div>
                     <div className='space-y-2'>
                        {details.entertainment.movieRecommendations.map(movie => (
                            <div key={movie.title} className='bg-red-50 p-3 rounded-lg'>
                                <p className='font-bold text-red-800'>{movie.title}</p>
                                <p className='text-sm text-red-700'>{movie.reason}</p>
                            </div>
                        ))}
                    </div>
                    <p className='text-xs text-sky-600 mt-2'>Find these on streaming sites like: {details.entertainment.streamingSites.join(', ')}</p>
                </section>

                <section className="pt-4 border-t border-sky-100">
                    <div className="flex items-center mb-2">
                        <DirectionsIcon className="h-6 w-6 text-purple-500"/>
                        <h3 className="text-xl font-semibold text-sky-800 ml-2">Directions to Next Stop</h3>
                    </div>
                    <p className="text-sky-700">{details.directionsToNext}</p>
                </section>
              </div>
            )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        
        @keyframes slide-up {
            from { transform: translateY(20px) scale(0.98); opacity: 0.8; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; }
      `}</style>
    </div>
  );
};

export default DestinationDetailModal;