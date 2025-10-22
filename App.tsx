// FIX: Add global declaration for window.google to fix TypeScript error.
declare global {
  interface Window {
    google: any;
  }
}

import React, { useState, useCallback, useEffect } from 'react';
import type { TravelPlan, Destination, DestinationDetails } from './types';
import { fetchTravelPlan, fetchDestinationDetails } from './services/geminiService';
import { loadGoogleMapsApi } from './utils/mapsLoader';
import SearchBar from './components/SearchBar';
import MapDisplay from './components/MapDisplay';
import DestinationCard from './components/DestinationCard';
import DestinationDetailModal from './components/DestinationDetailModal';
import { PlaneIcon } from './components/icons/PlaneIcon';
import ApiKeyModal from './components/ApiKeyModal';

const App: React.FC = () => {
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCountry, setCurrentCountry] = useState<string>('');
  const [currentDays, setCurrentDays] = useState<number>(7);

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [destinationDetails, setDestinationDetails] = useState<DestinationDetails | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  
  const [mapsApiKey, setMapsApiKey] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);
  
  const initializeMaps = useCallback(async (key: string) => {
    try {
        await loadGoogleMapsApi(key);
        setIsMapsApiLoaded(true);
        setError(null); // Clear previous errors on successful load
    } catch (err) {
        console.error("Maps API failed to load:", err);
        setError("Could not load Google Maps. Please check your API key and network connection.");
        localStorage.removeItem('googleMapsApiKey');
        setMapsApiKey(null);
        setIsMapsApiLoaded(false);
        setIsApiKeyModalOpen(true);
    }
  }, []);
  
  useEffect(() => {
    const storedKey = localStorage.getItem('googleMapsApiKey');
    if (storedKey) {
      setMapsApiKey(storedKey);
      initializeMaps(storedKey);
    } else {
      setIsApiKeyModalOpen(true);
    }
  }, [initializeMaps]);

  const handleSaveApiKey = (key: string) => {
    if(!key.trim()) {
        alert("Please enter a valid API key.");
        return;
    }
    localStorage.setItem('googleMapsApiKey', key);
    setMapsApiKey(key);
    setIsApiKeyModalOpen(false);
    initializeMaps(key);
  };


  const handleSearch = useCallback(async (country: string, days: number) => {
    if (!country.trim()) {
      setError('Please enter a country name.');
      return;
    }
    if (!mapsApiKey || !isMapsApiLoaded) {
        setError('Please set a valid Google Maps API key to search.');
        setIsApiKeyModalOpen(true);
        return;
    }

    setLoading(true);
    setError(null);
    setTravelPlan(null);
    setSelectedDestination(null);
    setDestinationDetails(null);
    setCurrentCountry(country);
    setCurrentDays(days);

    try {
      const plan = await fetchTravelPlan(country, days);
      setTravelPlan(plan);
    } catch (e) {
      console.error(e);
      setError('Sorry, we couldn\'t fetch a travel plan. The country might be invalid or there was a network issue. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [mapsApiKey, isMapsApiLoaded]);
  
  const handleDestinationSelect = useCallback(async (destination: Destination) => {
    if (!travelPlan) return;
    
    setSelectedDestination(destination);
    setIsDetailLoading(true);
    
    try {
      const details = await fetchDestinationDetails(destination, currentCountry, travelPlan.destinations);
      setDestinationDetails(details);
    } catch (e) {
      console.error("Failed to fetch destination details:", e);
      // Provide a more comprehensive error structure
      setDestinationDetails({
        dailyPlans: [{ day: 1, title: "Error", activities: [{ name: "Could not load plan", description: "Please try again."}] }],
        directionsToNext: "Could not load directions.",
        packingAndTips: { packingList: ["-"], travelTips: ["-"] },
        entertainment: { movieRecommendations: [{ title: "Error", reason: "Could not load recommendations." }], streamingSites: ["-"] }
      });
    } finally {
      setIsDetailLoading(false);
    }
  }, [travelPlan, currentCountry]);

  const handleCloseModal = () => {
    setSelectedDestination(null);
    setDestinationDetails(null);
  };

  return (
    <div className="min-h-screen bg-[#E0F7FF] text-sky-900 font-sans">
      <header className="bg-[#E0F7FF]/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-3">
            <PlaneIcon className="h-8 w-8 text-[#00A3FF]" />
            <h1 className="text-2xl font-bold text-sky-900 tracking-tight">Smart Travel Planner</h1>
          </div>
          <div className="w-full sm:w-auto sm:max-w-md">
            <SearchBar onSearch={handleSearch} loading={loading} defaultDays={currentDays} />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isApiKeyModalOpen && <ApiKeyModal onSave={handleSaveApiKey} />}

        {loading && (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-t-4 border-sky-200 animate-spin border-t-[#00A3FF]"></div>
                <PlaneIcon className="h-8 w-8 text-[#00A3FF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
            </div>
            <p className="text-xl font-semibold text-sky-800 mt-6">Crafting your {currentDays}-day adventure in {currentCountry}...</p>
            <p className="text-sky-600 mt-1">This is where the magic happens!</p>
          </div>
        )}

        {error && (
            <div className="mt-16 text-center bg-red-50 border-l-4 border-red-400 text-red-800 p-4" role="alert">
                <p className="font-bold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        )}

        {!loading && !travelPlan && !error && (
          <div className="text-center mt-20">
            <div className="inline-block bg-white/60 p-6 rounded-full">
              <PlaneIcon className="h-24 w-24 text-[#00A3FF] transform -rotate-12" />
            </div>
            <h2 className="mt-8 text-3xl font-bold text-sky-900">Your Next Adventure Awaits</h2>
            <p className="mt-3 text-lg text-sky-700 max-w-xl mx-auto">Tell us where you're dreaming of going and for how long. We'll handle the rest.</p>
          </div>
        )}
        
        {travelPlan && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-4 animate-fade-in-up">
            <div className="lg:col-span-3">
               <h2 className="text-3xl font-bold text-sky-900 mb-4">Your Itinerary Map for {currentCountry}</h2>
               {isMapsApiLoaded ? (
                 <MapDisplay 
                    destinations={travelPlan.destinations} 
                    boundingBox={travelPlan.boundingBox} 
                    onMarkerClick={handleDestinationSelect}
                    selectedDestination={selectedDestination}
                 />
               ) : (
                 <div className="w-full h-96 lg:h-[70vh] bg-sky-100 rounded-lg flex items-center justify-center">
                    <p className="text-sky-600">{mapsApiKey ? "Loading Map..." : "Please set your API Key to view the map"}</p>
                 </div>
               )}
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-sky-900 mb-4">Trip Overview</h2>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 -mr-2">
                {travelPlan.destinations.map((dest) => (
                  <DestinationCard 
                    key={dest.name} 
                    destination={dest} 
                    onSelect={handleDestinationSelect}
                    isSelected={selectedDestination?.name === dest.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {selectedDestination && (
        <DestinationDetailModal 
            destination={selectedDestination}
            details={destinationDetails}
            isLoading={isDetailLoading}
            onClose={handleCloseModal}
        />
      )}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;