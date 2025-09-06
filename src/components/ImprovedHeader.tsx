import { MapPin, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "", direction: 'ltr' },
  { code: "hi", name: "Hindi", nativeName: "", flag: "", direction: 'ltr' },
  { code: "te", name: "Telugu", nativeName: "", flag: "", direction: 'ltr' },
  { code: "ta", name: "Tamil", nativeName: "", flag: "", direction: 'ltr' },
  { code: "bn", name: "Bengali", nativeName: "", flag: "", direction: 'ltr' },
  { code: "mr", name: "Marathi", nativeName: "", flag: "", direction: 'ltr' },
  { code: "gu", name: "Gujarati", nativeName: "", flag: "", direction: 'ltr' },
  { code: "kn", name: "Kannada", nativeName: "", flag: "", direction: 'ltr' },
  { code: "ml", name: "Malayalam", nativeName: "", flag: "", direction: 'ltr' },
  { code: "pa", name: "Punjabi", nativeName: "", flag: "", direction: 'ltr' },
  { code: "ur", name: "Urdu", nativeName: "", flag: "", direction: 'rtl' },
  { code: "as", name: "Assamese", nativeName: "", flag: "", direction: 'ltr' },
  { code: "or", name: "Odia", nativeName: "", flag: "", direction: 'ltr' },
];

// Translation content
const translations = {
  en: {
    title: "KisanAI",
    subtitle: "Smart Agriculture Platform",
  },
  hi: {
    title: "",
    subtitle: "",
  },
  te: {
    title: "",
    subtitle: "",
  }
};

const ImprovedHeader = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  // Geolocation state
  const [locationText, setLocationText] = useState<string>("Detecting location...");
  const [locError, setLocError] = useState<string | null>(null);
  const [isLocLoading, setIsLocLoading] = useState<boolean>(true);
  const watchIdRef = useRef<number | null>(null);

  // Note: Weather is displayed in RealTimeWeatherCard. Header only shows location.

  // Detect user's browser language on component mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = languages.find(lang => lang.code === browserLang);

    if (supportedLang) {
      setDetectedLanguage(browserLang);
      setCurrentLanguage(browserLang);
      document.dir = supportedLang.direction;
    }
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      // OpenStreetMap Nominatim reverse geocoding (no API key required)
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, {
        headers: {
          // Note: Browsers may ignore custom User-Agent; Referer is typically sent automatically
        },
      });
      if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
      const data = await res.json();
      const addr = data.address || {};
      const locality = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || "";
      const district = addr.state_district || addr.county || "";
      const state = addr.state || "";
      const country = addr.country_code ? String(addr.country_code).toUpperCase() : "";

      const parts = [locality, district || state].filter(Boolean);
      const label = parts.length ? parts.join(', ') + (country ? `, ${country}` : '') : data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      setLocationText(label);
      setLocError(null);
    } catch (e: any) {
      setLocError(e?.message || 'Unable to determine location');
      setLocationText(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    } finally {
      setIsLocLoading(false);
    }
  };

  const startGeolocation = () => {
    if (!('geolocation' in navigator)) {
      setLocError('Geolocation not supported');
      setIsLocLoading(false);
      return;
    }

    // Clear any existing watcher before starting a new one
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setIsLocLoading(true);
        reverseGeocode(latitude, longitude);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setLocError('Location permission denied');
          setLocationText('Permission denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocError('Location unavailable');
          setLocationText('Location unavailable');
        } else if (err.code === err.TIMEOUT) {
          setLocError('Location request timed out');
          setLocationText('Location timeout');
        } else {
          setLocError('Failed to get location');
          setLocationText('Location error');
        }
        setIsLocLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 10000 }
    );

    watchIdRef.current = id as unknown as number;
  };

  useEffect(() => {
    // Attempt to query permission state (optional; not supported everywhere)
    try {
      navigator.permissions?.query({ name: 'geolocation' }).then(() => {
        startGeolocation();
      }).catch(() => startGeolocation());
    } catch {
      startGeolocation();
    }

    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const handleRetry = () => {
    setLocError(null);
    setIsLocLoading(true);
    startGeolocation();
  };

  return (
    <header className="bg-card border-b border-card-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                {t.title}
              </h1>
              <p className="text-xs text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>

          {/* Live Location */}
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-card-border bg-accent min-w-[220px] justify-center">
              {isLocLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Detecting location...</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground truncate max-w-[280px]" title={locError ? undefined : locationText}>
                    {locError ? 'Location unavailable' : locationText}
                  </span>
                  {locError && (
                    <button onClick={handleRetry} className="ml-2 text-xs text-primary underline">
                      Retry
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export { ImprovedHeader, translations };
export default ImprovedHeader;