import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';

const ColorContext = createContext();

const ColorProvider = ({children}) => {
  const [isLoading, setIsLoading] = useState(true);

  const [colors, setColors] = useState({
    color2: '#26A69A',
    lightcolor: '#9DE4DC',
    color3: '#DDD',
    color4: '#007167',
    color5: '#DDD',
  });

  const [menuIds, setMenuIDs] = useState([]);
  // [28, 320, 2, 46, 174, 52, 3, 1, 91, 448, 392, 96, 116, 381, 111, 465, 192,100, 497, 341, 616]
  useEffect(() => {
    const getColorfromStorage = async () => {
      try {
        const ThemeColor = await AsyncStorage.getItem('ThemeColor');
        if (ThemeColor) {
          const parsedColors = JSON.parse(ThemeColor);
          setColors(parsedColors.Colors);
        }
      } catch (error) {
        console.error('Failed to load theme color from AsyncStorage', error);
      } finally {
        setIsLoading(false);
      }
    };

    getColorfromStorage();
  }, []);

  const updateColor = (key, value) => {
    setColors(prevColors => ({
      ...prevColors,
      [key]: value,
    }));
  };

  const updateAllColors = newColors => {
    setColors(newColors);
  };

  const updateMenuIds = Ids => {
    setMenuIDs(Ids);
  };

  const clearMenuIds = () => {
    setMenuIDs([]);
  };

  return (
    <ColorContext.Provider value={{colors, updateColor, updateAllColors, menuIds,updateMenuIds,clearMenuIds}}>
      {children}
    </ColorContext.Provider>
  );
};

export {ColorContext, ColorProvider};
