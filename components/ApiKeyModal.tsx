import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');

  const handleSave = () => {
    onSave(apiKey);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-sky-800 mb-4">Google Maps API Key Required</h2>
        <p className="text-sky-700 mb-4">
          To display interactive maps, this app requires a Google Maps API key. It will be saved in your browser's local storage for future visits.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a1 1 0 011 1v3a1 1 0 01-2 0V6a1 1 0 011-1zm1 5a1 1 0 10-2 0v2a1 1 0 102 0v-2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Billing Is Required</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                        <p>To prevent errors ("this page can't load...") or "For development purposes only" watermarks, you <strong>must enable Billing</strong> on your Google Cloud project.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-sky-50 border-l-4 border-sky-400 p-4 mb-4">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-sky-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-sky-700">
                        In the <a href="https://console.cloud.google.com/google/maps-apis/overview" target="_blank" rel="noopener noreferrer" className="font-medium underline hover:text-sky-600">Google Cloud Console</a>, please ensure you have enabled the <strong>"Maps JavaScript API"</strong> for your project and check for website restrictions.
                    </p>
                </div>
            </div>
        </div>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key here"
          className="w-full px-4 py-2 text-sky-800 bg-white border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A3FF] mb-4"
        />
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-[#00A3FF] text-white font-semibold rounded-md hover:bg-[#0082cc] focus:outline-none focus:ring-2 focus:ring-[#00A3FF] focus:ring-offset-2 disabled:bg-sky-300"
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
};

export default ApiKeyModal;