import React, { useState, useEffect } from 'react';

const Header = () => {

    const [darkMode, setDarkMode] = useState(true);
    const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };


  return (
    <nav className="bg-gray-100 dark:bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-xl font-bold text-gray-900 dark:text-gray-100">Monedero Personal</a>

        {/* Botones de modo oscuro y menú en pantallas pequeñas */}
        <div className="flex items-center space-x-4 md:hidden">
          <button onClick={toggleDarkMode} className="text-gray-900 dark:text-gray-100">
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </div>

    </nav>
  );
};

export default Header;