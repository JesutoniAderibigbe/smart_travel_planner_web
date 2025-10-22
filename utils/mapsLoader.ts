declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

let mapsApiPromise: Promise<void> | null = null;

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

export const loadGoogleMapsApi = (apiKey: string): Promise<void> => {
  if (mapsApiPromise) {
    return mapsApiPromise;
  }

  mapsApiPromise = new Promise((resolve, reject) => {
    // If the API is already loaded, resolve immediately.
    if (window.google && window.google.maps) {
      return resolve();
    }
    
    // If a script tag is already on the page, perhaps from a previous attempt, wait for it.
    // This handles the case where the component re-renders while the script is still loading.
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement;

    if (existingScript) {
        // If the script exists but failed, reject.
        existingScript.onerror = () => {
            mapsApiPromise = null; // Reset for a retry.
            document.getElementById(GOOGLE_MAPS_SCRIPT_ID)?.remove();
            reject(new Error("Google Maps script failed to load."));
        }
    }

    // Define the global callback function
    window.initMap = () => {
      resolve();
    };

    // If there is no script tag, create and append it.
    if (!existingScript) {
        const script = document.createElement('script');
        script.id = GOOGLE_MAPS_SCRIPT_ID;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;
        script.onerror = () => {
            // Clean up on error
            mapsApiPromise = null; // Allow retrying
            document.getElementById(GOOGLE_MAPS_SCRIPT_ID)?.remove();
            reject(new Error("Google Maps script failed to load."));
        };
        document.head.appendChild(script);
    }

  });

  return mapsApiPromise;
};
