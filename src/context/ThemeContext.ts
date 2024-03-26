import {createContext} from 'react';

export type ThemeContextType = {
  theme: 'light' | 'dark' | null | undefined;
  setTheme: React.Dispatch<
    React.SetStateAction<'light' | 'dark' | null | undefined>
  >;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export default ThemeContext;
