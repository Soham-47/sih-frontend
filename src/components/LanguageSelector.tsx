import React from "react";
import { useTranslation } from "react-i18next";

type Language = {
  code: string;
  label: string;
};

const languages: Language[] = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "te", label: "తెలుగు" },
  { code: "ta", label: "தமிழ்" },
  { code: "or", label: "ଓଡ଼ିଆ" }
];

export default function LanguageSelector(): JSX.Element {
  const { i18n } = useTranslation();

  const changeLang = (lng: string): void => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    window.location.reload();
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language" className="text-sm font-medium text-gray-700">
        🌐 Language:
      </label>
      <select
        id="language"
        value={i18n.language || "en"}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          changeLang(e.target.value)
        }
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
