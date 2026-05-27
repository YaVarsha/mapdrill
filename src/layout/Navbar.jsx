import "./Navbar.css";
import { useRef, useState } from "react";
import {
  FiSearch,
  FiChevronDown,
  FiLogOut,
  FiMoon,
  FiSettings,
  FiUser,
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
  const [activePanel, setActivePanel] = useState(null);
  const [signedOut, setSignedOut] = useState(() => (
    localStorage.getItem("geodrill-session") === "signed-out"
  ));
  const profileMenuRef = useRef(null);

  const openPanel = (panelName) => {

    setActivePanel(panelName);

    if (profileMenuRef.current) {

      profileMenuRef.current.open = false;
    }
  };

  const closePanel = () => {

    setActivePanel(null);
  };

  const handleLogout = () => {

    localStorage.setItem("geodrill-session", "signed-out");
    setSignedOut(true);
    setActivePanel("signed-out");
  };

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
          className={`theme-switch ${darkMode ? "active" : ""}`}
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
          <span className="theme-switch-icon">
            {darkMode ? <HiOutlineSun /> : <FiMoon />}
          </span>

          <span className="theme-switch-text">
            <span className="theme-switch-title">
              {language === "en" ? "Theme" : "Theme"}
            </span>

            <span className="theme-switch-value">
              {darkMode
                ? language === "en" ? "Dark" : "Dark"
                : language === "en" ? "Light" : "Light"}
            </span>
          </span>
        </button>

        {/* PROFILE */}
        <details className="profile-menu" ref={profileMenuRef}>
          <summary className="profile-section">

          <div className="avatar">
            A
          </div>

          <span className="profile-copy">
            <span className="admin-text">
            {language === "en"
              ? "Admin User"
              : "एडमिन यूज़र"}
            </span>

            <span className="profile-role">
              Map Manager
            </span>
          </span>

            <FiChevronDown className="dropdown-icon" />

          </summary>

          <div className="profile-dropdown">
            <button
              type="button"
              className="profile-dropdown-item"
              onClick={() => openPanel("profile")}
            >
              <FiUser />
              <span>Profile</span>
            </button>

            <button
              type="button"
              className="profile-dropdown-item"
              onClick={() => openPanel("settings")}
            >
              <FiSettings />
              <span>Settings</span>
            </button>

            <button
              type="button"
              className="profile-dropdown-item danger"
              onClick={() => openPanel("logout")}
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </details>

      </div>

      {activePanel && (
        <div className="account-modal-backdrop" role="presentation">
          <section
            className="account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
          >
            <div className="account-modal-header">
              <div>
                <p className="account-modal-kicker">MapLens Account</p>

                <h2 id="account-modal-title">
                  {activePanel === "profile" && "Profile"}
                  {activePanel === "settings" && "Settings"}
                  {activePanel === "logout" && "Logout"}
                  {activePanel === "signed-out" && "Signed out"}
                </h2>
              </div>

              <button
                type="button"
                className="account-modal-close"
                aria-label="Close panel"
                onClick={closePanel}
              >
                x
              </button>
            </div>

            {activePanel === "profile" && (
              <div className="account-panel">
                <div className="profile-summary-card">
                  <div className="profile-summary-avatar">A</div>

                  <div>
                    <h3>Admin User</h3>
                    <p>Map Manager</p>
                  </div>
                </div>

                <dl className="profile-detail-list">
                  <div>
                    <dt>Role</dt>
                    <dd>Map Manager</dd>
                  </div>

                  <div>
                    <dt>Access</dt>
                    <dd>District, block, and village map controls</dd>
                  </div>

                  <div>
                    <dt>Status</dt>
                    <dd>{signedOut ? "Signed out" : "Active"}</dd>
                  </div>
                </dl>
              </div>
            )}

            {activePanel === "settings" && (
              <div className="account-panel">
                <div className="setting-row">
                  <div>
                    <h3>Language</h3>
                    <p>Choose the interface language.</p>
                  </div>

                  <div className="setting-actions">
                    <button
                      type="button"
                      className={language === "en" ? "active" : ""}
                      onClick={() => setLanguage("en")}
                    >
                      EN
                    </button>

                    <button
                      type="button"
                      className={language === "hi" ? "active" : ""}
                      onClick={() => setLanguage("hi")}
                    >
                      Hindi
                    </button>
                  </div>
                </div>

                <div className="setting-row">
                  <div>
                    <h3>Theme</h3>
                    <p>Switch between light and dark map workspace.</p>
                  </div>

                  <button
                    type="button"
                    className={`setting-toggle ${darkMode ? "active" : ""}`}
                    onClick={() => setDarkMode((currentMode) => !currentMode)}
                  >
                    {darkMode ? "Dark" : "Light"}
                  </button>
                </div>
              </div>
            )}

            {activePanel === "logout" && (
              <div className="account-panel">
                <p className="logout-copy">
                  Logout will end the current Map Manager session on this browser.
                </p>

                <div className="account-modal-actions">
                  <button
                    type="button"
                    className="secondary-action"
                    onClick={closePanel}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="danger-action"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {activePanel === "signed-out" && (
              <div className="account-panel">
                <p className="logout-copy">
                  You are signed out. Sign in again to continue as Map Manager.
                </p>

                <button
                  type="button"
                  className="primary-action"
                  onClick={() => {

                    localStorage.setItem("geodrill-session", "active");
                    setSignedOut(false);
                    closePanel();
                  }}
                >
                  Sign in as Admin User
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </header>
  );
};

export default Navbar;
