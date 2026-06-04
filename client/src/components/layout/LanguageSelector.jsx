import React from "react";
import { useTranslation } from "react-i18next";
import { Languages, ChevronDown } from "lucide-react";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "bn", label: "বাংলা" },
    { code: "kn", label: "ಕನ್ನಡ" },
    { code: "ta", label: "தமிழ்" },
  ];

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer shadow-sm">
        <Languages size={16} className="text-green-600" />
        <span className="text-xs font-bold text-gray-700">
          {languages.find((l) => i18n.language.startsWith(l.code))?.label ||
            "Language"}
        </span>
        <ChevronDown
          size={12}
          className="text-gray-400 group-hover:rotate-180 transition-transform"
        />
      </div>

      <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        {languages.map((lng) => (
          <button
            key={lng.code}
            onClick={() => i18n.changeLanguage(lng.code)}
            className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${
              i18n.language.startsWith(lng.code)
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            {lng.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
