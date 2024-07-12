import React, { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  // Load initial dark mode state from local storage, defaulting to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  console.log(isDarkMode);
  //retrieve karega darkmode key se associated value (localStorage.getItem("darkMode"))
  //then check karega agar true hoga to true nhi to false ayega
  //darkMode is the key jisme store karenge value nd string mein change kr diya hai
  // Effect to update dark mode in local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    // Update the class on <html> element to apply dark mode styles
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const contextValue = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
