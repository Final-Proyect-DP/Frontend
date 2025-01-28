import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import Chatbot from "./chatbot"; // Importar Chatbot
import Mapgen from "./mapgenerator"; // Importar Mapgen

const Iamodule = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (activeComponent) {
      case "chatbot":
        return <Chatbot />;
      case "mapgenerator":
        return <Mapgen />;
      // Agregar más casos aquí para otros componentes
      default:
        return null;
    }
  };

  return (
    <>
      <section className="relative block h-[11vh] bg-black">
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <div className="flex flex-col lg:flex-row h-[89vh] bg-white text-black overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 bg-black p-4 text-white lg:block hidden">
          <h1 className="text-2xl font-bold mb-6">AI Module</h1>
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-full h-12"
            onClick={() => setActiveComponent("chatbot")}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full text-center">
              ChatBot
            </span>
          </button>
          <button
            className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800 w-full h-12"
            onClick={() => setActiveComponent("mapgenerator")}
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full text-center">
              Conceptual Map Generator
            </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 w-full h-12">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full text-center">
              Summarize
            </span>
          </button>
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-white-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 w-full h-12">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-black dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 w-full text-center">
              Image Generator
            </span>
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-white bg-opacity-75 flex flex-col overflow-hidden">
          {renderComponent()}
        </main>
      </div>
      <div className="fixed bottom-0 left-0 p-4 text-sm text-gray-400">
        Powered by Gemini
      </div>
    </>
  );
};

export default Iamodule;
export { Iamodule };
