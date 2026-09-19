import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [categories, setCategories] = useState(() => storageService.getCategories());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'dark');
    storageService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  const updateSettings = (newPartialSettings) => {
    setSettings(prev => {
      const updated = { ...prev, ...newPartialSettings };
      return updated;
    });
  };

  const addCategory = (categoryObj) => {
    setCategories(prev => [...prev, categoryObj]);
  };

  const deleteCategory = (categoryId) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSettings,
      categories,
      addCategory,
      deleteCategory
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
