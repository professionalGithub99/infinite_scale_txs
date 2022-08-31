import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

const savedTheme = localStorage.getItem('theme');

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(savedTheme || '#6BCB77')

  const toggleTheme = (color) => {
    setTheme(color.hex)
    localStorage.setItem('theme', color.hex)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{ children }</ThemeContext.Provider>
}