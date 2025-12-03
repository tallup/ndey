"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Navigation, DollarSign, Clock, Truck, CheckCircle } from "lucide-react";
import { api } from "@/lib/api";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/ShippingMap"), {
  ssr: false,
});

interface DeliveryLocation {
  id: number;
  name: string;
  region: string;
  delivery_fee: number | null;
  is_active: boolean;
}

interface LocationCoordinates {
  [key: string]: { lat: number; lng: number };
}

// Approximate coordinates for villages in The Gambia (West Coast Region)
// These would ideally come from the database, but for now we'll use approximations
const locationCoordinates: LocationCoordinates = {
  'Lamin': { lat: 13.38987, lng: -16.64261 }, // Shop location
  'Brikama': { lat: 13.27194, lng: -16.64778 },
  'Busumbala': { lat: 13.41667, lng: -16.66667 },
  'Yundum': { lat: 13.35000, lng: -16.63333 },
  'Serekunda': { lat: 13.43333, lng: -16.66667 },
  'Bakoteh': { lat: 13.45000, lng: -16.68333 },
  'Manjai': { lat: 13.44000, lng: -16.68000 },
  'Latrikunda': { lat: 13.43000, lng: -16.67000 },
  'Kanifing': { lat: 13.44306, lng: -16.67500 },
  'Tallinding': { lat: 13.42000, lng: -16.66000 },
  'Bundung': { lat: 13.41000, lng: -16.65000 },
  'Ebo Town': { lat: 13.40000, lng: -16.64000 },
  'Abuko': { lat: 13.30000, lng: -16.65000 },
  'Kombo Central': { lat: 13.35000, lng: -16.70000 },
  'Kombo North': { lat: 13.40000, lng: -16.70000 },
  'Bakau': { lat: 13.47806, lng: -16.68139 },
  'Fajara': { lat: 13.47000, lng: -16.69000 },
  'Kololi': { lat: 13.45000, lng: -16.70000 },
  'Kotu': { lat: 13.46000, lng: -16.69000 },
  'Brusubi': { lat: 13.48000, lng: -16.71000 },
  'Bijilo': { lat: 13.44000, lng: -16.72000 },
  'Sukuta': { lat: 13.41000, lng: -16.71000 },
  'Kerr Serign': { lat: 13.39000, lng: -16.70000 },
  'Kombo South': { lat: 13.30000, lng: -16.70000 },
  'Brufut': { lat: 13.35000, lng: -16.75000 },
  'Tanji': { lat: 13.30000, lng: -16.75000 },
  'Tujereng': { lat: 13.25000, lng: -16.75000 },
  'Gunjur': { lat: 13.20000, lng: -16.75000 },
  'Kartong': { lat: 13.15000, lng: -16.80000 },
};

const SHOP_LOCATION = { lat: 13.38987, lng: -16.64261 };

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export default function ShippingPage() {
  const [locations, setLocations] = useState<DeliveryLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<DeliveryLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.get("/delivery-locations");
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching delivery locations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleLocationSelect = (location: DeliveryLocation) => {
    setSelectedLocation(location);
    setShowDirections(true);
    
    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // If user denies location, use selected location coordinates
          const coords = locationCoordinates[location.name];
          if (coords) {
            setUserLocation(coords);
          }
        }
      );
    } else {
      // Fallback to location coordinates if geolocation not available
      const coords = locationCoordinates[location.name];
      if (coords) {
        setUserLocation(coords);
      }
    }
  };

  const getLocationDistance = (locationName: string): number | null => {
    const coords = locationCoordinates[locationName];
    if (!coords) return null;
    return calculateDistance(
      SHOP_LOCATION.lat,
      SHOP_LOCATION.lng,
      coords.lat,
      coords.lng
    );
  };

  const getLocationCoords = (locationName: string) => {
    return locationCoordinates[locationName] || null;
  };

  const locationsWithDistance = locations.map(loc => ({
    ...loc,
    distance: getLocationDistance(loc.name),
    coordinates: getLocationCoords(loc.name),
  })).sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return (a.distance || 0) - (b.distance || 0);
  }) as (DeliveryLocation & { distance: number | null; coordinates: { lat: number; lng: number } | null })[];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" style={{ backgroundSize: "200% 200%" }} />

        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6"
            >
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Delivery Locations & Pricing</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Shipping{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Information
              </span>
            </h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              We deliver to locations across the West Coast Region. Select a location to see pricing and get directions to our shop.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Map and Locations Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="lg:sticky lg:top-8 h-[600px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              {!loading && (
                <MapComponent
                  shopLocation={SHOP_LOCATION}
                  selectedLocation={selectedLocation ? getLocationCoords(selectedLocation.name) : null}
                  userLocation={userLocation}
                  showDirections={showDirections}
                  allLocations={locations}
                  locationCoordinates={locationCoordinates}
                />
              )}
            </div>

            {/* Locations List */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-2">
                  Delivery <span className="gradient-text">Locations</span>
                </h2>
                <p className="text-gray-600">
                  Select a location to see pricing and get directions
                </p>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-24" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {locationsWithDistance.map((location) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleLocationSelect(location)}
                      className={`bg-white rounded-xl p-6 border-2 cursor-pointer transition-all ${
                        selectedLocation?.id === location.id
                          ? "border-purple-500 shadow-lg"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MapPin className="w-5 h-5 text-purple-600" />
                            <h3 className="text-xl font-bold">{location.name}</h3>
                            {selectedLocation?.id === location.id && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            {location.distance !== null && (
                              <div className="flex items-center gap-1">
                                <Navigation className="w-4 h-4" />
                                <span>{location.distance.toFixed(1)} km</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Same day delivery</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {(() => {
                            const feeValue = typeof location.delivery_fee === 'string' 
                              ? parseFloat(location.delivery_fee) 
                              : location.delivery_fee;
                            return feeValue !== null && feeValue !== undefined && feeValue > 0 ? (
                              <div className="flex items-center gap-1 text-2xl font-bold text-purple-600">
                                <DollarSign className="w-5 h-5" />
                                <span>D{feeValue.toFixed(2)}</span>
                              </div>
                            ) : (
                              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                Free
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Shop Information */}
      {selectedLocation && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200"
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Delivery to {selectedLocation.name}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-lg">Delivery Fee</h4>
                    </div>
                    {(() => {
                      const feeValue = typeof selectedLocation.delivery_fee === 'string' 
                        ? parseFloat(selectedLocation.delivery_fee) 
                        : selectedLocation.delivery_fee;
                      return feeValue !== null && feeValue !== undefined && feeValue > 0 ? (
                        <p className="text-3xl font-bold text-purple-600">
                          D{feeValue.toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-green-600">Free Delivery</p>
                      );
                    })()}
                  </div>

                {(() => {
                  const distance = getLocationDistance(selectedLocation.name);
                  return distance !== null && (
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Navigation className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-lg">Distance</h4>
                      </div>
                      <p className="text-3xl font-bold text-purple-600">
                        {distance.toFixed(1)} km
                      </p>
                    </div>
                  );
                })()}
              </div>

              {showDirections && userLocation && (
                <div className="mt-6 bg-white rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-purple-600" />
                    Directions
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Our shop is located in Lamin. Use the map above to get directions from your location.
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${SHOP_LOCATION.lat},${SHOP_LOCATION.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                  >
                    <Navigation className="w-5 h-5" />
                    Open in Google Maps
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}

      {/* Info Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Delivery <span className="gradient-text">Information</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Delivery Time</h3>
                <p className="text-gray-600">Same day delivery for orders placed before 2 PM</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <Truck className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
                <p className="text-gray-600">Free delivery for locations without set pricing</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                <CheckCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                <p className="text-gray-600">Cash on delivery available for all orders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
