import React, {useState} from 'react';
import ThemeContext from './ThemeContext';
import {Appearance} from 'react-native';

const ThemeContextProvider = ({children}): React.JSX.Element => {
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
