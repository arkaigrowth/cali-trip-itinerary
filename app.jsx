import React, { useState, useEffect, useRef } from 'react';

function App() {
  // Ref for the map container div
  const mapRef = useRef(null);
  // State to hold the Leaflet map instance
  const [mapInstance, setMapInstance] = useState(null);
  // State to hold the itinerary data with coordinates, colors, and labels
  const [itinerary, setItinerary] = useState([]);
  // State to hold the currently selected day for filtering
  const [selectedDay, setSelectedDay] = useState('All Days');
  // State to manage the open/closed state of sidebar day details
  const [openDays, setOpenDays] = useState({});

  // Define a palette of distinct colors for each day
  const dayColors = [
    '#FF6347', // Tomato (Day 1)
    '#4682B4', // SteelBlue (Day 2)
    '#32CD32', // LimeGreen (Day 3)
    '#FFD700', // Gold (Day 4)
    '#8A2BE2', // BlueViolet (Day 5)
    '#FF4500', // OrangeRed (Day 6)
    '#1E90FF', // DodgerBlue (Day 7)
    '#DA70D6', // Orchid (Day 8)
    '#20B2AA', // LightSeaGreen (Day 9)
    '#FF8C00', // DarkOrange (Day 10)
    '#8B0000', // DarkRed (Day 11)
    '#00CED1'  // DarkTurquoise (Day 12)
  ];

  // Define the itinerary data with estimated coordinates and full activity descriptions
  const rawItinerary = [
    {
      day: 'Day 1: Wednesday, June 11',
      locations: [
        { name: 'SFO Arrival & Lodging', lat: 37.6213, lng: -122.3790, activity: 'Arrive at SFO, pick up rental car. Drive to your first lodging. Consider staying somewhere south of San Francisco for easier access out of the city initially, or near SFO for convenience. For example, Pacifica or Half Moon Bay.' },
        { name: 'Pacifica Exploration', lat: 37.6375, lng: -122.4930, activity: 'Explore Pacifica. Walk along the coast, perhaps see the Pacifica Pier. This is a good, gentle introduction to the coastline. Lunch: Casual seafood in Pacifica.' },
        { name: 'Half Moon Bay & Dinner', lat: 37.4636, lng: -122.4286, activity: 'Drive to Half Moon Bay. Enjoy the coastal scenery. Dinner: Consider Sam\'s Chowder House (popular, can be busy) for oysters or other seafood with an ocean view. Lodging: Overnight in Pacifica/Half Moon Bay area. Look for motels or smaller hotels. (Parking should be generally available at accommodations here).' },
      ],
    },
    {
      day: 'Day 2: Thursday, June 12',
      locations: [
        { name: 'Half Moon Bay Breakfast', lat: 37.4636, lng: -122.4286, activity: 'Breakfast: Local cafe in Half Moon Bay.' },
        { name: 'Swanton Berry Farm', lat: 37.0425, lng: -122.1818, activity: 'Stop at Swanton Berry Farm (check seasonal availability for U-pick or farm stand).' },
        { name: 'Davenport & Shark Fin Cove', lat: 37.0090, lng: -122.1020, activity: 'Visit Davenport for its rugged coastline and perhaps the Davenport Crack. Explore Shark Fin Cove (Bonny Doon Beach). Be aware of the "nude beach" reputation for Bonny Doon if that\'s a concern; Shark Fin Cove itself is scenic. Parking is usually along the highway, requiring a short walk.' },
        { name: 'Santa Cruz Exploration', lat: 36.9630, lng: -122.0290, activity: 'Lunch: Windmill Cafe in Santa Cruz (as recommended by Maciej) or another spot in Santa Cruz. Activity: Explore Santa Cruz. Walk along West Cliff Drive for views, see the surfers at Steamer Lane. Consider a stroll on the Santa Cruz Wharf (can be touristy, but good for sea lion viewing). You might enjoy Pleasure Point for more coastal views. Panther Beach is another option nearby, known for its beauty. Dinner: In Santa Cruz. Lodging: Overnight in Santa Cruz. Many motels offer parking.' },
      ],
    },
    {
      day: 'Day 3: Friday, June 13',
      locations: [
        { name: 'Carmel-by-the-Sea', lat: 36.5552, lng: -121.9230, activity: 'Drive south to Carmel-by-the-Sea. Explore Carmel: Walk around the charming village, admire the architecture and art galleries (from outside), and visit Carmel Beach. Parking can be tricky in town; look for street parking or city lots. Scenic Drive: Drive a portion of the 17-Mile Drive in Pebble Beach (entry fee applies) for stunning coastal views and the Lone Cypress, or opt for the equally beautiful (and free) Scenic Road along Carmel\'s coastline.' },
        { name: 'Point Lobos State Natural Reserve', lat: 36.5170, lng: -121.9480, activity: 'Alternative if skipping Hearst Castle: Spend more time in Carmel or visit Point Lobos State Natural Reserve (beautiful easy walks, incredible coastal scenery – can get crowded, arrive early).' },
        { name: 'Drive to Palo Alto Area', lat: 37.4419, lng: -122.1430, activity: 'Late Afternoon/Evening: Drive towards the Palo Alto area. This is a longer drive (2-2.5 hours from Carmel, longer if from Hearst Castle). Dinner: En route or upon arrival in the Palo Alto/Menlo Park area. Lodging: Check into lodging in or near Palo Alto for the next three nights to be convenient for Greg\'s events. Economical options might be found in Redwood City, Mountain View, or Sunnyvale. Ensure your hotel has overnight parking.' },
      ],
    },
    {
      day: 'Day 4: Saturday, June 14',
      locations: [
        { name: 'Menlo Park & Tech Campuses', lat: 37.4529, lng: -122.1817, activity: 'Explore Menlo Park. Drive by the Google Campus (Googleplex) and Meta (Facebook) Campus. These are largely for drive-by viewing of the signage and external architecture, as public access to the interiors is restricted.' },
        { name: 'Woodside Gentle Walk', lat: 37.4040, lng: -122.2850, activity: 'Consider a gentle walk in Woodside. Look for trails at Wunderlich County Park or Edgewood Park and Natural Preserve, known for wildflowers (seasonal) and easy paths.' },
        { name: 'Palo Alto Relaxation & Dinner', lat: 37.4430, lng: -122.1610, activity: 'Lunch: San Pedro Square Market in San Jose (if you venture a bit further south) offers diverse food options. Alternatively, find a cafe in Palo Alto or Menlo Park. Activity: Relax, perhaps a light stroll through downtown Palo Alto or Stanford University\'s outdoor campus areas (e.g., the Main Quad, Rodin Sculpture Garden). Evening: Dinner with Greg (presumably in/near Palo Alto). Lodging: Overnight in Palo Alto area.' },
      ],
    },
    {
      day: 'Day 5: Sunday, June 15',
      locations: [
        { name: 'Palo Alto & Stanford Morning', lat: 37.4419, lng: -122.1430, activity: 'Relaxed morning. Perhaps revisit a favorite local spot or explore another part of the Stanford campus (e.g., Arizona Garden, Hoover Tower exterior for views). Lunch: In Palo Alto.' },
        { name: 'Graduation Ceremony', lat: 37.4275, lng: -122.1697, activity: 'Afternoon: Rest and prepare for the evening\'s event. Allow ample time for travel and parking around the graduation venue. Evening: Greg\'s graduation ceremony in Palo Alto (7 PM). Dinner: Late dinner after the ceremony, perhaps with Greg and family if plans align. Lodging: Overnight in Palo Alto area.' }, // Using Stanford coords as a general Palo Alto event location
      ],
    },
    {
      day: 'Day 6: Monday, June 16',
      locations: [
        { name: 'Drive to San Francisco & Check-in', lat: 37.7800, lng: -122.4100, activity: 'Leisurely breakfast. Drive from Palo Alto to San Francisco (approx. 45-60 mins without traffic). Check into your San Francisco lodging. Consider options that offer parking, even if it\'s an added fee, for convenience. Lunch: Near your hotel or in the first area you explore.' },
        { name: 'Alamo Square & Painted Ladies', lat: 37.7760, lng: -122.4330, activity: 'Alamo Square & Painted Ladies. Find parking in the residential streets around the park (can be challenging, read signs carefully). Enjoy the iconic view.' },
        { name: 'Lombard Street', lat: 37.8021, lng: -122.4192, activity: 'Walk/drive down Lombard Street (the curvy part). You can drive it or walk alongside it. Parking at the top or bottom is very limited; it might be best to park further away and walk.' },
        { name: 'North Beach & Columbus Ave', lat: 37.8000, lng: -122.4100, activity: 'Explore North Beach and Columbus Avenue. This area has a vibrant history (Beat Generation). Enjoy the atmosphere. Dinner: Plenty of Italian and other options in North Beach. Lodging: Overnight in San Francisco.' },
      ],
    },
    {
      day: 'Day 7: Tuesday, June 17',
      locations: [
        { name: 'Haight-Ashbury & Golden Gate Park Entry', lat: 37.7690, lng: -122.4500, activity: 'Drive towards Golden Gate Park, entering via the Panhandle and Haight-Ashbury district. Park your car (street parking in Haight-Ashbury or lots within/near the park) and explore Haight-Ashbury on foot. See the Victorian architecture, unique shops (crystal shops, thrift stores, Amoeba Music). Note the Grateful Dead House (710 Ashbury St). Lunch: Casual lunch in Haight-Ashbury or find a spot near Golden Gate Park.' },
        { name: 'Golden Gate Park Exploration', lat: 37.7694, lng: -122.4862, activity: 'Explore Golden Gate Park (outdoors): Conservatory of Flowers (admire the building and surrounding gardens). Japanese Tea Garden (has an entrance fee, but it\'s a beautiful outdoor experience if you choose to enter). Walk to the Bison Paddock. Visit the AIDS Memorial Grove (a serene, contemplative space). Optional: Rent Lyft bikes for easier park exploration, then Uber back to your car if parked far away. This could indeed be a large part of your day.' },
        { name: 'Twin Peaks', lat: 37.7559, lng: -122.4474, activity: 'Drive to Twin Peaks for panoramic city views (can coordinate with Maciej if he\'s available to show you). Go before sunset for daylight and potentially sunset views. Parking is available at the top. Dinner: In a neighborhood like the Castro or back towards your lodging. Lodging: Overnight in San Francisco.' },
      ],
    },
    {
      day: 'Day 8: Wednesday, June 18',
      locations: [
        { name: 'Presidio Exploration', lat: 37.8000, lng: -122.4600, activity: 'Explore the Presidio. This large national park site offers many outdoor options: Drive or walk to viewpoints of the Golden Gate Bridge (e.g., Battery East, Golden Gate Overlook). Walk along Crissy Field for views of the bridge, Alcatraz, and the city skyline. See the Palace of Fine Arts (located near the edge of the Presidio/Marina). Admire the architecture and lagoon. Parking is available around it.' },
        { name: 'Marina District & Union Street', lat: 37.8020, lng: -122.4360, activity: 'Lunch: In the Marina district or a cafe in the Presidio (e.g., Spruce or Presidio Picnic if it\'s a Thursday-Sunday). Activity: Explore the Marina District. Walk up and down Union Street (as Maciej suggested) for its shops and atmosphere. You could coordinate with Maciej if he\'s at his office in the Marina.' },
        { name: 'Greenwood Steps & Dinner', lat: 37.7940, lng: -122.4440, activity: 'Consider the Greenwood Steps (Lyon Street Steps) for views, though be mindful of your father\'s energy as they are steep. The views from the top are rewarding. Dinner: In the Marina or Cow Hollow. Lodging: Overnight in San Francisco.' },
      ],
    },
    {
      day: 'Day 9: Thursday, June 19',
      locations: [
        { name: 'Chinatown & Grace Cathedral', lat: 37.7941, lng: -122.4078, activity: 'Visit Chinatown (largest in the US). Park in a nearby garage (e.g., Portsmouth Square Plaza Garage) and explore on foot. This is a good place for souvenir shopping. Walk by Grace Cathedral (Nob Hill) – admire its exterior and perhaps the labyrinth outside. Lunch: Dim sum or other Chinese cuisine in Chinatown.' },
        { name: 'Alcatraz Glimpse & Japantown', lat: 37.8080, lng: -122.4090, activity: 'If interested in seeing Alcatraz from the water without the indoor tour, consider a bay cruise that goes near it. Many depart from Pier 39/Fisherman\'s Wharf. (Pier 39 is touristy, as you noted, but it\'s a departure point). Alternatively, revisit a favorite spot or explore a new neighborhood like Japantown (oldest in the US). See the "R-Evolution" statue (if it\'s still installed and publicly accessible – its location can change as it\'s art). It was previously near the Financial District/Embarcadero.' },
        { name: 'Coit Tower & Dinner', lat: 37.8024, lng: -122.4058, activity: 'Consider Coit Tower (exterior views). The murals inside are famous, but you can enjoy the panoramic views from the base or Telegraph Hill. Parking at Coit Tower is very limited; consider walking up from North Beach or taking a ride-share. Dinner: In North Beach or Fisherman\'s Wharf if you did a bay cruise. Lodging: Overnight in San Francisco.' },
      ],
    },
    {
      day: 'Day 10: Friday, June 20',
      locations: [
        { name: 'Golden Gate Bridge & Marin Headlands', lat: 37.8199, lng: -122.4783, activity: 'Drive across the Golden Gate Bridge (toll applies southbound on return). Stop at Battery Spencer or Hawk Hill in the Marin Headlands for iconic postcard views of the bridge and city. Parking can be competitive, especially on weekends. Explore more of the Marin Headlands – coastal trails, historic batteries.' },
        { name: 'Mt. Tamalpais & Sausalito', lat: 37.9230, lng: -122.5970, activity: 'Lunch: Picnic lunch with views, or find a spot in Sausalito (can be touristy but scenic). Activity: Drive up Mt. Tamalpais. There are numerous vista points and areas for short, easy walks with incredible views. The East Peak offers a paved trail to a fire lookout. (Check for any road closures or reservation requirements). Dinner: In Sausalito for waterfront dining, or head back towards SF or your preferred area. Lodging: Overnight in San Francisco or consider staying in southern Marin (e.g., Sausalito, Mill Valley) if you want a different vibe for the last couple of nights, though this might be less "economical."' },
      ],
    },
    {
      day: 'Day 11: Saturday, June 21',
      locations: [
        { name: 'Point Reyes National Seashore', lat: 38.0700, lng: -122.8800, activity: 'Full Day Trip Option 1: Point Reyes National Seashore. Drive to Point Reyes National Seashore (approx. 1-1.5 hours from SF). Visit the Point Reyes Lighthouse (check for access, involves many stairs down, so assess for your father). The views from the area are spectacular even without going all the way down. Explore Drakes Beach or Limantour Beach. Lunch: Oysters at Tomales Bay Oyster Company or Hog Island Oyster Co. (reservations often needed, especially on weekends) or a deli in Point Reyes Station. Short walks, perhaps see the Tule Elk Preserve if time permits. Drive back to San Francisco.' },
        { name: 'UC Berkeley & Tilden Park (Alternative)', lat: 37.8719, lng: -122.2585, activity: 'Full Day Trip Option 2: East Bay - Berkeley. Drive to Berkeley. Explore the UC Berkeley campus (outdoor areas like Sproul Plaza, Campanile exterior). Visit the Greek Theatre (see its impressive exterior). Lunch: In Berkeley, known for diverse food (Gourmet Ghetto area). Visit Tilden Regional Park for views of the Bay or a walk in the Regional Parks Botanic Garden (focuses on California native plants). Drive back to San Francisco.' },
        { name: 'Farewell Dinner', lat: 37.7749, lng: -122.4194, activity: 'Evening: Farewell dinner at a restaurant of your choice. Lodging: Overnight in San Francisco.' },
      ],
    },
    {
      day: 'Day 12: Sunday, June 22',
      locations: [
        { name: 'Last Views & Departure', lat: 37.7599, lng: -122.4148, activity: 'Leisurely breakfast and pack. Depending on your flight time and energy, you could: Revisit a favorite spot for a final look. Explore a neighborhood you missed, like the Mission District (known for its murals – can be viewed by walking or a slow drive). Do some last-minute souvenir shopping (Chinatown as Maciej advised). Lunch: Based on your location. Head towards SFO. Allow plenty of time to return the rental car and for airport check-in. Evening: Depart from SFO at 11:30 PM.' },
      ],
    },
  ];

  // Process the raw itinerary to add color and label properties
  const processedFullItinerary = rawItinerary.map((dayData, dayIndex) => {
    const dayNumber = dayIndex + 1;
    const color = dayColors[dayIndex % dayColors.length]; // Cycle through colors if more days than colors
    return {
      ...dayData,
      locations: dayData.locations.map((loc, locIndex) => ({
        ...loc,
        color: color,
        label: `${dayNumber}${String.fromCharCode(65 + locIndex)}` // A=65, B=66, etc.
      }))
    };
  });

  // Function to load Leaflet CSS and JS dynamically
  const loadLeaflet = () => {
    return new Promise((resolve, reject) => {
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      link.onload = () => {
        // Load JS after CSS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        script.onload = () => {
          // Fix for default marker icon not showing up and merge custom options
          if (window.L && window.L.Icon && window.L.Icon.Default) {
            delete window.L.Icon.Default.prototype._getIconUrl;
            window.L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            });
          }
          resolve(window.L); // Resolve with the Leaflet object
        };
        script.onerror = reject;
        document.head.appendChild(script);
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };

  // Function to create a custom DivIcon for Leaflet markers
  const createCustomIcon = (label, color) => {
    if (!window.L) return null; // Ensure Leaflet is loaded
    return new window.L.DivIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">${label}</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30], // Anchor at the bottom center of the circle
      popupAnchor: [0, -25] // Popup appears above the marker
    });
  };

  // Effect to load Leaflet and initialize the map
  useEffect(() => {
    loadLeaflet().then((L) => {
      if (mapRef.current && !mapInstance) {
        // Initialize the map
        const allProcessedLocations = processedFullItinerary.flatMap(day => day.locations);
        const initialCenter = calculateCenter(allProcessedLocations);
        const map = L.map(mapRef.current).setView(initialCenter, 8); // Default zoom for all days

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        setMapInstance(map);
      }
    }).catch(error => {
      console.error("Failed to load Leaflet:", error);
    });

    // Cleanup function: remove map instance on component unmount
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [mapInstance]); // Dependency on mapInstance to prevent re-initialization

  // Effect to update markers when itinerary or mapInstance changes
  useEffect(() => {
    if (mapInstance && window.L) { // Ensure Leaflet is loaded
      // Clear existing markers
      mapInstance.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstance.removeLayer(layer);
        }
      });

      // Add new markers based on the current itinerary
      itinerary.forEach(loc => {
        const customIcon = createCustomIcon(loc.label, loc.color);
        if (customIcon) {
          const marker = window.L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(mapInstance);
          marker.bindPopup(`
            <div class="font-inter">
              <h4 class="font-bold text-indigo-700">${loc.name}</h4>
              <p class="text-sm text-gray-700">${loc.day}</p>
              <details class="mt-2">
                <summary class="font-semibold text-gray-800 cursor-pointer">Activity Details</summary>
                <p class="text-sm text-gray-600 mt-1 whitespace-pre-wrap">${loc.activity}</p>
              </details>
            </div>
          `);
        }
      });

      // Adjust map view to fit all markers or center on selected day
      if (itinerary.length > 0) {
        const bounds = new window.L.LatLngBounds(itinerary.map(loc => [loc.lat, loc.lng]));
        if (selectedDay === 'All Days') {
          mapInstance.fitBounds(bounds, { padding: [50, 50] });
        } else {
          mapInstance.setView(calculateCenter(itinerary), 12); // Zoom in for single day
        }
      } else {
        // If no locations, reset to a default view (e.g., San Francisco)
        mapInstance.setView([37.7749, -122.4194], 8);
      }
    }
  }, [itinerary, mapInstance, selectedDay]);

  // Effect to set the initial itinerary or filter based on selectedDay
  useEffect(() => {
    if (selectedDay === 'All Days') {
      // Flatten all locations from all days
      const allLocations = processedFullItinerary.flatMap(day =>
        day.locations.map(loc => ({ ...loc, day: day.day }))
      );
      setItinerary(allLocations);
    } else {
      // Filter locations for the selected day
      const filtered = processedFullItinerary.find(day => day.day === selectedDay);
      if (filtered) {
        setItinerary(filtered.locations.map(loc => ({ ...loc, day: filtered.day })));
      } else {
        setItinerary([]);
      }
    }
  }, [selectedDay]);

  // Handler to toggle open state of day details in sidebar
  const toggleDay = (day) => {
    setOpenDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  // Calculate the center of the map based on a given set of locations
  const calculateCenter = (locationsToCenter) => {
    if (locationsToCenter.length === 0) {
      // Default to San Francisco if no locations are present
      return [37.7749, -122.4194];
    }

    let latSum = 0;
    let lngSum = 0;
    locationsToCenter.forEach(loc => {
      latSum += loc.lat;
      lngSum += loc.lng;
    });
    return [latSum / locationsToCenter.length, lngSum / locationsToCenter.length];
  };

  return (
    <div className="flex flex-col md:flex-row h-screen font-inter">
      {/* Sidebar for Day Selection and Itinerary List */}
      <div className="w-full md:w-1/3 bg-gray-100 p-4 overflow-y-auto shadow-lg rounded-lg m-2">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">California Trip Itinerary</h1>

        {/* Day Selection Dropdown */}
        <div className="mb-4">
          <label htmlFor="day-select" className="block text-sm font-medium text-gray-700 mb-1">
            View by Day:
          </label>
          <select
            id="day-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="All Days">All Days</option>
            {processedFullItinerary.map((day, index) => (
              <option key={index} value={day.day}>
                {day.day}
              </option>
            ))}
          </select>
        </div>

        {/* Itinerary List */}
        <div className="space-y-4">
          {selectedDay === 'All Days' ? (
            processedFullItinerary.map((dayData, dayIndex) => (
              <div key={dayIndex} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer font-bold text-lg text-indigo-800"
                  onClick={() => toggleDay(dayData.day)}
                >
                  {dayData.day}
                  <span>{openDays[dayData.day] ? '▲' : '▼'}</span>
                </div>
                {openDays[dayData.day] && (
                  <div className="mt-2 space-y-2">
                    {dayData.locations.map((loc, locIndex) => (
                      <div key={locIndex} className="bg-gray-50 p-3 rounded-md border border-gray-100">
                        <h4 className="text-md font-semibold text-indigo-700 mb-1">{loc.label} - {loc.name}</h4>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">{loc.activity}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            itinerary.length > 0 ? (
              itinerary.map((loc, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-1">{loc.label} - {loc.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{loc.day}</p>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{loc.activity}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Select a day or "All Days" to see locations.</p>
            )
          )}
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full md:w-2/3 h-full md:h-auto m-2 rounded-lg overflow-hidden shadow-lg"
        style={{ minHeight: '400px' }} // Ensure map container has a height
      >
        {/* Leaflet map will be rendered here */}
      </div>
    </div>
  );
}

export default App;
