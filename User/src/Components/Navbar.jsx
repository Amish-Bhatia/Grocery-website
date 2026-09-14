import React from "react";

const Navbar = () => {
  return (
    <header className="w-full">

      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center h-8 text-xs text-gray-500 px-4">
{/* 
          <div>
            //todo                                Location
          </div> */}

          <div className="flex items-center gap-5">

            <select
              name="language"
              defaultValue="Eng"
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="Eng">Eng</option>
              <option value="Hin">Hin</option>
              <option value="Fra">Fra</option>
              <option value="Ger">Ger</option>
            </select>

           
            <select
              name="currency"
              defaultValue="USD"
              className="bg-transparent outline-none cursor-pointer">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>

            <span>|</span>

          
            <a href="/login" className="hover:text-green-600">
              Sign in / Sign up
            </a>

          </div>

        </div>
      </div>

    </header>
  );
};

export default Navbar;
