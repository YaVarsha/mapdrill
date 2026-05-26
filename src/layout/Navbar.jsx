import "./Navbar.css";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiMoon,
} from "react-icons/fi";

import { HiOutlineSun } from "react-icons/hi";

const Navbar = ({
  language,
  setLanguage,
  darkMode,
  setDarkMode,
  searchOptions = [],
  searchQuery,
  setSearchQuery,
  onSearchSelect,
}) => {

  const findSearchMatch = (query) => {

    const normalizedQuery =
      query.trim().toLowerCase();

    if (!normalizedQuery) return null;

    return (
      searchOptions.find((option) =>
        option.name.toLowerCase() === normalizedQuery ||
        option.label.toLowerCase() === normalizedQuery
      ) ||
      searchOptions.find((option) =>
        option.name.toLowerCase().includes(normalizedQuery) ||
        option.label.toLowerCase().includes(normalizedQuery)
      )
    );
  };

  const handleSearch = (query) => {

    const match =
      findSearchMatch(query);

    if (!match) return;

    setSearchQuery(match.label);
    onSearchSelect?.(match);
  };

  return (
    <header className="topbar">

      {/* LEFT */}
      <div className="navbar-left">

        <div className="logo-section">
          <div className="logo-icon">
            🌐
          </div>

          <div className="logo-text">
            <h1>GeoDrill</h1>

            <p>
              {language === "en"
                ? "Location Explorer"
                : "लोकेशन एक्सप्लोरर"}
            </p>
          </div>
        </div>

        <button className="menu-btn">
          <FiMenu />
        </button>

      </div>

      {/* SEARCH */}
      <div className="navbar-center">

        <div className="search-box">

          <FiSearch className="search-icon" />

          <input
            type="text"
            list="location-search-options"
            value={searchQuery}
            placeholder={
              language === "en"
                ? "Search for country, state, city or area..."
                : "देश, राज्य या क्षेत्र खोजें..."
            }
            onChange={(event) => {

              const value =
                event.target.value;

              setSearchQuery(value);

              const exactMatch =
                findSearchMatch(value);

              if (
                exactMatch &&
                (
                  exactMatch.name.toLowerCase() === value.trim().toLowerCase() ||
                  exactMatch.label.toLowerCase() === value.trim().toLowerCase()
                )
              ) {

                onSearchSelect?.(exactMatch);
              }
            }}
            onKeyDown={(event) => {

              if (event.key === "Enter") {

                handleSearch(searchQuery);
              }
            }}
          />

          <datalist id="location-search-options">
            {searchOptions.map((option) => (

              <option
                key={`${option.type}-${option.name}`}
                value={option.label}
              />
            ))}
          </datalist>

          <div className="shortcut-key">
            ⌘ K
          </div>

        </div>

      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        {/* LANGUAGE SWITCH */}
        <div className="lang-switch">

          <button
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>

          <button
            className={language === "hi" ? "active" : ""}
            onClick={() => setLanguage("hi")}
          >
            हिंदी
          </button>

        </div>

        {/* DARK MODE */}
        <button
          className={`icon-btn theme-toggle-btn ${darkMode ? "active" : ""}`}
          type="button"
          aria-label={
            darkMode
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          title={
            darkMode
              ? "Light theme"
              : "Dark theme"
          }
          onClick={() => setDarkMode((currentMode) => !currentMode)}
        >
          {darkMode ? <HiOutlineSun /> : <FiMoon />}
        </button>

        {/* NOTIFICATION */}
        <button className="icon-btn notification-btn">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        {/* PROFILE */}
        <div className="profile-section">

          <div className="avatar">
            A
          </div>

          <span className="admin-text">
            {language === "en"
              ? "Admin User"
              : "एडमिन यूज़र"}
          </span>

          <FiChevronDown className="dropdown-icon" />

        </div>

      </div>
    </header>
  );
};

export default Navbar;
