import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { useAuth0 } from "@auth0/auth0-react";
import config from "../../config";
import axios from "axios";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState("home");
  const { user, isAuthenticated, logout, isLoading, getAccessTokenSilently } =
    useAuth0();
  const { isDarkMode, toggleDarkMode } = useContext(StoreContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    const saveUser = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const accessToken = await getAccessTokenSilently();
        const userData = {
          auth0Id: user.sub,
          name: user.name,
          email: user.email,
          picture: user.picture,
        };

        await axios.post(`${config.apiBaseUrl}/addUser`, userData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

    saveUser();
  }, [isAuthenticated, user, getAccessTokenSilently, isDarkMode]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isLoading) {
    return (
      <div role="status">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    ); // Render a loading indicator while Auth0 is loading
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-[#000000]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mb-8">
        <Link
          to="/"
          onClick={() => setSelected("home")}
          className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">
            QuizApp
          </span>
        </Link>
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!isAuthenticated ? (
            <button
              onClick={() => loginWithRedirect()}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 lg:mx-2 md:mx-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Login
            </button>
          ) : (
            <div className="relative items-center z-40  lg:mx-2">
              <button
                id="avatarButton"
                type="button"
                onClick={toggleDropdown}
                className="w-10 h-10 rounded-full cursor-pointer">
                <img
                  src={user.picture}
                  alt="User dropdown"
                  className="w-10 h-10 rounded-full"
                />
              </button>

              {dropdownOpen && (
                <div
                  id="userDropdown"
                  className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg  shadow-sm shadow-black dark:shadow-sm dark:shadow-white dark:bg-[#000000] dark:divide-gray-600">
                  <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    <div>{user.name}</div>
                    <div className="font-medium truncate">{user.email}</div>
                  </div>
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        to="/List"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        My List
                      </Link>
                    </li>
                  </ul>
                  <div className="py-1">
                    <button
                      onClick={() =>
                        logout({ returnTo: window.location.origin })
                      }
                      className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <input
            type="checkbox"
            className="theme-checkbox"
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded={isMenuOpen ? "true" : "false"}>
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? "block" : "hidden"
          }`}
          id="navbar-cta">
          <NavbarLinks selected={selected} setSelected={setSelected} />
        </div>
      </div>
    </nav>
  );
}

function NavbarLinks({ selected, setSelected }) {
  const { isAuthenticated } = useAuth0();
  return (
    <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-[#000000]">
      <li>
        <Link
          to="/"
          onClick={() => setSelected("home")}
          className={
            selected === "home"
              ? "block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
              : "block py-2 px-3 md:p-0 text-gray-900 rounded md:bg-transparent md:text-gray-900 dark:text-white"
          }>
          Home
        </Link>
      </li>

      <li>
        <Link
          to="/Encrypt"
          onClick={() => setSelected("Encrypt")}
          className={
            selected === "Encrypt"
              ? "block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
              : "block py-2 px-3 md:p-0 text-gray-900 rounded md:bg-transparent md:text-gray-900 dark:text-white"
          }>
          Encrypt
        </Link>
      </li>
      <li>
        <Link
          to="/decrypt"
          onClick={() => setSelected("decrypt")}
          className={
            selected === "decrypt"
              ? "block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
              : "block py-2 px-3 md:p-0 text-gray-900 rounded md:bg-transparent md:text-gray-900 dark:text-white"
          }>
          Decrypt
        </Link>
      </li>
      {isAuthenticated && (
        <li>
          <Link
            to="/Takequiz"
            onClick={() => setSelected("takequiz")}
            className={
              selected === "takequiz"
                ? "block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:dark:text-blue-500"
                : "block py-2 px-3 md:p-0 text-gray-900 rounded md:bg-transparent md:text-gray-900 dark:text-white"
            }>
            Take Quiz
          </Link>
        </li>
      )}
    </ul>
  );
}

export default Navbar;
