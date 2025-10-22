import { GoogleGenAI, Type } from "@google/genai";
import type { TravelPlan, Destination, DestinationDetails } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destinations: {
      type: Type.ARRAY,
      description: "A list of 3-5 key tourist destinations (cities or regions).",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the tourist destination.",
          },
          description: {
            type: Type.STRING,
            description: "A brief, engaging description of the destination (2-3 sentences).",
          },
          location: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER, description: "Latitude of the destination." },
              lng: { type: Type.NUMBER, description: "Longitude of the destination." },
            },
            required: ["lat", "lng"],
          },
          suggestedDays: {
            type: Type.INTEGER,
            description: "The recommended number of days to spend in this destination.",
          },
          imageUrl: {
            type: Type.STRING,
            description: "A publicly accessible, high-quality image URL for the destination."
          }
        },
        required: ["name", "description", "location", "suggestedDays", "imageUrl"],
      },
    },
    boundingBox: {
        type: Type.OBJECT,
        description: "The geographical bounding box that contains all the destinations.",
        properties: {
            north: { type: Type.NUMBER, description: "Northernmost latitude." },
            south: { type: Type.NUMBER, description: "Southernmost latitude." },
            east: { type: Type.NUMBER, description: "Easternmost longitude." },
            west: { type: Type.NUMBER, description: "Westernmost longitude." },
        },
        required: ["north", "south", "east", "west"],
    }
  },
  required: ["destinations", "boundingBox"],
};

const destinationDetailsSchema = {
    type: Type.OBJECT,
    properties: {
        dailyPlans: {
            type: Type.ARRAY,
            description: "A detailed day-by-day itinerary for the specified number of days.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number (e.g., 1, 2, 3)." },
                    title: { type: Type.STRING, description: "A catchy title for the day's theme (e.g., 'Historical Heart & Culinary Delights')." },
                    activities: {
                        type: Type.ARRAY,
                        description: "A list of activities for the day.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING, description: "Name of the activity or place to visit." },
                                description: { type: Type.STRING, description: "A one-sentence description, which could include a tip or a restaurant suggestion." }
                            },
                            required: ["name", "description"]
                        }
                    }
                },
                required: ["day", "title", "activities"]
            }
        },
        directionsToNext: {
            type: Type.STRING,
            description: "Narrative travel directions from the current destination to the next, mentioning mode of transport and estimated time."
        },
        packingAndTips: {
            type: Type.OBJECT,
            properties: {
                packingList: {
                    type: Type.ARRAY,
                    description: "A list of 5-7 essential items to pack for this specific destination.",
                    items: { type: Type.STRING }
                },
                travelTips: {
                    type: Type.ARRAY,
                    description: "Two useful, concise travel tips for this destination (e.g., 'Public transport is very efficient,' or 'Try the local street food.').",
                    items: { type: Type.STRING }
                }
            },
            required: ["packingList", "travelTips"]
        },
        entertainment: {
            type: Type.OBJECT,
            properties: {
                movieRecommendations: {
                    type: Type.ARRAY,
                    description: "Two movie recommendations that are filmed in or are thematically related to the destination.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "The title of the movie." },
                            reason: { type: Type.STRING, description: "A brief reason why it's a good movie to watch for this trip." }
                        },
                        required: ["title", "reason"]
                    }
                },
                streamingSites: {
                    type: Type.ARRAY,
                    description: "A list of 2-3 popular streaming sites where these movies might be available, such as Ventura, Netflix, etc.",
                    items: { type: Type.STRING }
                }
            },
            required: ["movieRecommendations", "streamingSites"]
        }
    },
    required: ["dailyPlans", "directionsToNext", "packingAndTips", "entertainment"]
};


export const fetchTravelPlan = async (country: string, days: number): Promise<TravelPlan> => {
  const prompt = `You are an expert travel planner. Create a travel plan for a ${days}-day trip to ${country}. Your plan should distribute the ${days} days among 3 to 5 key cities or regions. For each destination, provide its name, a short compelling description, a publicly accessible, directly linkable, high-quality image URL (preferably from Wikimedia Commons or a similar open-source repository), its precise latitude and longitude, and the number of days you suggest spending there. Ensure the sum of 'suggestedDays' equals the total trip duration of ${days} days. Also, provide a bounding box that encompasses all these locations.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: travelPlanSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (!parsedData.destinations || !parsedData.boundingBox) {
        throw new Error("Invalid data structure received from API.");
    }
    
    // Ensure the days add up, or adjust if the model made a mistake
    let totalSuggestedDays = parsedData.destinations.reduce((sum: number, dest: Destination) => sum + dest.suggestedDays, 0);
    if (totalSuggestedDays !== days && parsedData.destinations.length > 0) {
        console.warn(`AI suggested ${totalSuggestedDays} days, but user requested ${days}. Normalizing...`);
        // Basic normalization: add/remove days from the longest stay
        const diff = days - totalSuggestedDays;
        let targetIndex = 0;
        let maxDays = 0;
        parsedData.destinations.forEach((dest: Destination, index: number) => {
            if (dest.suggestedDays > maxDays) {
                maxDays = dest.suggestedDays;
                targetIndex = index;
            }
        });
        parsedData.destinations[targetIndex].suggestedDays += diff;
        // Ensure no destination has 0 or negative days
        if(parsedData.destinations[targetIndex].suggestedDays <= 0) {
             parsedData.destinations[targetIndex].suggestedDays = 1;
        }

    }


    return parsedData as TravelPlan;
  } catch (error) {
    console.error("Error fetching travel plan from Gemini API:", error);
    throw new Error("Failed to generate travel plan.");
  }
};

export const fetchDestinationDetails = async (destination: Destination, country: string, allDestinations: Destination[]): Promise<DestinationDetails> => {
    const currentIndex = allDestinations.findIndex(d => d.name === destination.name);
    const nextDestination = allDestinations[currentIndex + 1] || allDestinations[0]; // Loop back to the start

    const prompt = `You are a helpful travel assistant planning a trip to ${country}. The user wants a detailed plan for their ${destination.suggestedDays}-day stay in "${destination.name}". The next major destination on their trip is "${nextDestination.name}". 
    
    Please provide the following in JSON format:
    1. A day-by-day itinerary for the ${destination.suggestedDays} day(s) in "${destination.name}". Each day should have a title and 2-4 activities with short descriptions.
    2. Narrative travel directions from "${destination.name}" to "${nextDestination.name}".
    3. A "packingAndTips" object containing a 'packingList' of 5-7 essential items for this city, and two 'travelTips'.
    4. An "entertainment" object with two 'movieRecommendations' (title and reason) relevant to the location, and a list of 'streamingSites' like Ventura where they could be watched.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: destinationDetailsSchema,
                temperature: 0.5
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as DestinationDetails;
    } catch (error) {
        console.error("Error fetching destination details from Gemini API:", error);
        throw new Error("Failed to generate destination details.");
    }
};