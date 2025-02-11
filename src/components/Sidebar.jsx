import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-full lg:w-64 bg-gray-800 p-4 text-white lg:block hidden">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar en Marketplace"
          className="w-full p-2 pl-10 rounded-full bg-gray-700 text-white focus:outline-none"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-white" />
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <a href="#" className="hover:text-gold">
              Explorar todo
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gold">
              Notificaciones
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gold">
              Bandeja de entrada
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gold">
              Compra
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="hover:text-gold" onClick={() => navigate('/marketplace/sales')}>
              Venta
            </a>
          </li>
        </ul>
      </nav>
      <button
        className="w-full mt-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-black rounded hover:from-gray-400 hover:to-gray-600"
        onClick={() => navigate('/marketplace/create-product')}
      >
        + Crear publicación
      </button>
      <div className="mt-8">
        <h2 className="text-lg mb-4">Ubicación</h2>
        <p>Quito · En un radio de 23 km</p>
      </div>
      <div className="mt-8">
        <h2 className="text-lg mb-4">Categorías</h2>
        <ul>
          <li className="mb-2 hover:text-gold">Vehículos</li>
          <li className="mb-2 hover:text-gold">Alquiler de propiedades</li>
          <li className="mb-2 hover:text-gold">Aficiones</li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
