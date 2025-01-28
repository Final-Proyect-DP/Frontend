import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const GET_PRODUCTS_SERVER = import.meta.env.VITE_API_GET_PRODUCTS;
const GET_CATEGORY_SERVER = import.meta.env.VITE_API_GET_CATEGORY;
const GET_USER_SERVER = import.meta.env.VITE_API_GET_USER;

const fetchProducts = async () => {
  try {
    const productsResponse = await fetch(`${GET_PRODUCTS_SERVER}`);
    if (!productsResponse.ok) {
      throw new Error('Failed to fetch products');
    }
    const responseData = await productsResponse.json();

    if (!Array.isArray(responseData.products)) {
      throw new Error('Products response is not an array');
    }

    const productsWithDetails = await Promise.all(responseData.products.map(async (product) => {
      const userResponse = await fetch(`${GET_USER_SERVER}/${product.userId}`);
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user details');
      }
      const user = await userResponse.json();

      let category = {};
      if (product.category_id) {
        const categoryResponse = await fetch(`${GET_CATEGORY_SERVER}/${product.category_id}`);
        if (!categoryResponse.ok) {
          throw new Error('Failed to fetch category details');
        }
        const categoryData = await categoryResponse.json();
        category = categoryData.category;
      }

      return { ...product, user, category };
    }));

    return productsWithDetails;
  } catch (error) {
    throw error;
  }
};

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProductsData();
  }, []);

  const convertBinaryToImageSrc = (binaryData) => {
    return `data:image/jpeg;base64,${btoa(binaryData)}`;
  };

  return (
    <>
      <section className="relative block h-[11vh] bg-black">
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <div className="flex flex-col lg:flex-row h-screen bg-white text-black">
        {/* Sidebar */}
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
                <a href="#" className="hover:text-gold">
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

        {/* Main content */}
        <main className="flex-1 p-6 bg-white bg-opacity-75">
          <div className="lg:hidden flex justify-between mb-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar en Marketplace"
                className="w-full p-2 pl-10 rounded-full bg-gray-700 text-white focus:outline-none"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-white" />
            </div>
            <button
              className="ml-4 py-2 px-4 bg-gradient-to-r from-gray-300 to-gray-500 text-black rounded hover:from-gray-400 hover:to-gray-600"
              onClick={() => navigate('/marketplace/create-product')}
            >
              + Crear publicación
            </button>
          </div>
          <section className="mb-6">
            <h2 className="text-xl font-bold mb-4">Novedades para ti</h2>
            <div className="bg-gray-700 text-white p-4 rounded">
              <p>El artículo XBOX SERIE S ahora cuesta 15 $ menos.</p>
            </div>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Destacados de hoy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-200 p-4 rounded text-left text-black shadow-lg">
                  <img
                    src={convertBinaryToImageSrc(product.image_data)}
                    alt={product.name}
                    className="mb-4 rounded h-48 w-full object-cover"
                  />
                  <p className="font-bold text-lg">{product.price} $</p>
                  <p className="truncate">{product.name}</p>
                  <p className="truncate">{product.description}</p>
                  <p>Category: {product.category.name || 'N/A'}</p>
                  <p>Seller: {product.user.firstName} {product.user.lastName}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Marketplace;
export { Marketplace };
