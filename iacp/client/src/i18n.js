import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: { translation: { title: 'India Anti-Corruption Platform' } },
  hi: { translation: { title: 'भारत भ्रष्टाचार विरोधी मंच' } },
  mr: { translation: { title: 'भारत भ्रष्टाचार विरोधी प्लॅटफॉर्म' } },
}

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n