// import { createContext, useContext, useState } from 'react';
// import { extendTheme } from '@chakra-ui/react'; // Import extendTheme, not ThemeProvider

// // Определяем темы
// const lightTheme = extendTheme({
//     config: {
//         initialColorMode: 'light',
//         useSystemColorMode: false,
//     },
//     styles: {
//         global: {
//             body: {
//                 bg: 'gray.50',
//                 color: 'gray.800',
//             },
//         },
//     },
// });

// const darkTheme = extendTheme({
//     config: {
//         initialColorMode: 'dark',
//         useSystemColorMode: false,
//     },
//     styles: {
//         global: {
//             body: {
//                 bg: 'gray.800',
//                 color: 'gray.50', 
//             },
//         },
//     },
// });

// // 1. Создаем ThemeContext
// const ThemeContext = createContext();

// // 2. Создаем ThemeProvider
// export const ThemeProvider = ({ children }) => {
//     const [theme, setTheme] = useState('light');

//     const toggleTheme = () => {
//         setTheme(theme === 'light' ? 'dark' : 'light');
//     };

//     const themeData = {
//         theme: theme === 'light' ? lightTheme : darkTheme,
//         toggleTheme,
//     };

//     return (
//         <ThemeContext.Provider value={themeData}>
//             {children}
//         </ThemeContext.Provider>
//     );
// };

// // 3. Создаем и экспортируем useTheme Hook
// export const useTheme = () => useContext(ThemeContext);