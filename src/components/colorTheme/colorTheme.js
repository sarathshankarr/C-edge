import React, { createContext, useState } from 'react';

const ColorContext = createContext();

const ColorProvider = ({ children }) => {

  const [colors, setColors] = useState({
    color2: '#26A69A', 
    lightcolor: '#9DE4DC',
    color3: '#DDD', 
    color4: '#007167', 
    color5: '#DDD', 
  });

  const updateColor = (key, value) => {
    setColors((prevColors) => ({
      ...prevColors,
      [key]: value,
    }));
  };

  const updateAllColors = (newColors) => {
    setColors(newColors);
  };

  return (
    <ColorContext.Provider value={{ colors, updateColor,updateAllColors }}>
      {children}
    </ColorContext.Provider>
  );
};

export { ColorContext, ColorProvider };