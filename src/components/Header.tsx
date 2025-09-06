import { Globe, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
    { code: "bn", name: "বাংলা", flag: "🇮🇳" },
  ];

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === language) || languages[0];
  };

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
                KisanAI
              </h1>
              <p className="text-xs text-muted-foreground">Smart Agriculture Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </a>
            
            {/* Language Selector */}
            <div className="relative">
              <button 
                className="flex items-center space-x-2 px-3 py-2 bg-accent rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getCurrentLanguage().flag} {getCurrentLanguage().name}
                </span>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-lg shadow-medium z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-accent flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg bg-accent"
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
            <a href="#home" className="block text-foreground hover:text-primary">
              Home
            </a>
            <a href="#about" className="block text-foreground hover:text-primary">
              About
            </a>
            <a href="#contact" className="block text-foreground hover:text-primary">
              Contact
            </a>
            <div className="pt-2 border-t border-card-border">
              <p className="text-sm text-muted-foreground mb-2">Select Language:</p>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsMenuOpen(false);
                    }}
                    className={`p-2 rounded text-sm flex items-center space-x-2 ${
                      language === lang.code 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-accent hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
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

export default Header;