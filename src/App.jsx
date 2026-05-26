import {
  useEffect,
  useState,
} from "react";
import MainLayout from "./layout/MainLayout";

function App() {
  const [language, setLanguage] = useState(() => (
    localStorage.getItem("geodrill-language") || "en"
  ));

  const [darkMode, setDarkMode] = useState(() => (
    localStorage.getItem("geodrill-theme") === "dark"
  ));

  useEffect(() => {

    localStorage.setItem("geodrill-language", language);
  }, [language]);

  useEffect(() => {

    localStorage.setItem(
      "geodrill-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <MainLayout
      language={language}
      setLanguage={setLanguage}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  );
}

export default App;
