import { Globe, Menu, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", direction: 'ltr' },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳", direction: 'ltr' },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳", direction: 'ltr' },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳", direction: 'ltr' },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳", direction: 'ltr' },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳", direction: 'ltr' },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳", direction: 'ltr' },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳", direction: 'ltr' },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳", direction: 'ltr' },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳", direction: 'ltr' },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇮🇳", direction: 'rtl' },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", flag: "🇮🇳", direction: 'ltr' },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", flag: "🇮🇳", direction: 'ltr' },
];

// Translation content
const translations = {
  en: {
    title: "KisanAI",
    subtitle: "Smart Agriculture Platform",
    home: "Home",
    about: "About",
    contact: "Contact",
    support: "Support",
    selectLanguage: "Select Language",
    welcome: "Welcome to KisanAI Platform",
    description: "Empowering farmers with AI-driven insights for better crop yields, smart irrigation, and sustainable farming practices.",
    badges: {
      certified: "Government Certified",
      aiPowered: "AI Powered",
      farmerFriendly: "Farmer Friendly"
    },
    tools: "Smart Farming Tools",
    footer: "Ministry of Agriculture & Farmers Welfare",
    footerSubtitle: "Powered by Artificial Intelligence for Indian Agriculture"
  },
  hi: {
    title: "किसानAI",
    subtitle: "स्मार्ट कृषि प्लेटफॉर्म",
    home: "होम",
    about: "हमारे बारे में",
    contact: "संपर्क",
    support: "सहायता",
    selectLanguage: "भाषा चुनें",
    welcome: "किसानAI प्लेटफॉर्म में आपका स्वागत है",
    description: "बेहतर फसल उत्पादन, स्मार्ट सिंचाई और टिकाऊ कृषि प्रथाओं के लिए AI-संचालित अंतर्दृष्टि के साथ किसानों को सशक्त बनाना।",
    badges: {
      certified: "सरकारी प्रमाणित",
      aiPowered: "AI संचालित",
      farmerFriendly: "किसान अनुकूल"
    },
    tools: "स्मार्ट कृषि उपकरण",
    footer: "कृषि और किसान कल्याण मंत्रालय",
    footerSubtitle: "भारतीय कृषि के लिए कृत्रिम बुद्धिमत्ता द्वारा संचालित"
  },
  te: {
    title: "కిసాన్AI",
    subtitle: "స్మార్ట్ అగ్రికల్చర్ ప్లాట్‌ఫాం",
    home: "హోమ్",
    about: "మా గురించి",
    contact: "సంప్రదింపులు",
    support: "మద్దతు",
    selectLanguage: "భాష ఎంచుకోండి",
    welcome: "కిసాన్AI ప్లాట్‌ఫాంకు స్వాగతం",
    description: "మెరుగైన పంట దిగుబడులు, స్మార్ట్ నీటిపారుదల మరియు స్థిరమైన వ్యవసాయ పద్ధతుల కోసం AI-నడిచే అంతర్దృష్టులతో రైతులను శక్తివంతం చేయడం.",
    badges: {
      certified: "ప్రభుత్వ ధృవీకరణ",
      aiPowered: "AI శక్తితో",
      farmerFriendly: "రైతు అనుకూలం"
    },
    tools: "స్మార్ట్ వ్యవసాయ సాధనాలు",
    footer: "వ్యవసాయం మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ",
    footerSubtitle: "భారతీయ వ్యవసాయం కోసం కృత్రిమ మేధస్సుతో శక్తివంతం"
  }
};

const ImprovedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  // Detect user's browser language on component mount
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]; // Get language code without region
    const supportedLang = languages.find(lang => lang.code === browserLang);
    
    if (supportedLang && browserLang !== 'en') {
      setDetectedLanguage(browserLang);
      // Auto-switch to detected language if it's not English
      setCurrentLanguage(browserLang);
    }
  }, []);

  const getCurrentLanguage = (): Language => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  };

  const getCurrentTranslations = () => {
    return translations[currentLanguage as keyof typeof translations] || translations.en;
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLanguage(langCode);
    setIsLanguageMenuOpen(false);
    setIsMenuOpen(false);
    
    // Update document direction for RTL languages
    const selectedLang = languages.find(lang => lang.code === langCode);
    if (selectedLang) {
      document.dir = selectedLang.direction;
    }
  };

  const t = getCurrentTranslations();

  return (
    <header className="bg-card border-b border-card-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              {t.home}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              {t.about}
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              {t.contact}
            </a>
            <a href="#support" className="text-foreground hover:text-primary transition-colors">
              {t.support}
            </a>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-accent rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors border border-card-border"
                onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getCurrentLanguage().flag} {getCurrentLanguage().nativeName}
                </span>
                {detectedLanguage && currentLanguage === detectedLanguage && (
                  <div className="w-2 h-2 bg-success rounded-full" title="Auto-detected language" />
                )}
              </button>
              
              {isLanguageMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-card-border rounded-lg shadow-strong z-50 max-h-80 overflow-y-auto">
                  <div className="p-3 border-b border-card-border">
                    <p className="text-sm font-medium text-foreground">{t.selectLanguage}</p>
                    {detectedLanguage && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Auto-detected: {languages.find(l => l.code === detectedLanguage)?.nativeName}
                      </p>
                    )}
                  </div>
                  <div className="py-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-accent flex items-center justify-between transition-colors ${
                          currentLanguage === lang.code ? 'bg-accent border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{lang.flag}</span>
                          <div>
                            <div className="text-sm font-medium text-foreground">{lang.nativeName}</div>
                            <div className="text-xs text-muted-foreground">{lang.name}</div>
                          </div>
                        </div>
                        {currentLanguage === lang.code && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-accent border border-card-border"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-card-border">
          <div className="px-4 py-4 space-y-3">
            <a href="#home" className="block text-foreground hover:text-primary py-2">
              {t.home}
            </a>
            <a href="#about" className="block text-foreground hover:text-primary py-2">
              {t.about}
            </a>
            <a href="#contact" className="block text-foreground hover:text-primary py-2">
              {t.contact}
            </a>
            <a href="#support" className="block text-foreground hover:text-primary py-2">
              {t.support}
            </a>
            
            <div className="pt-3 border-t border-card-border">
              <div className="flex items-center space-x-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-foreground">{t.selectLanguage}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`p-3 rounded text-sm flex items-center space-x-2 border transition-colors ${
                      currentLanguage === lang.code 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-accent hover:bg-primary hover:text-primary-foreground border-card-border"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{lang.nativeName}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { ImprovedHeader, translations };
export default ImprovedHeader;