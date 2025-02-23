import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Sidebar from "../../components/Sidebar";
import FloatingButton from "../../components/FloatingButton";

const GET_PRODUCTS_SERVER = import.meta.env.VITE_API_GET_PRODUCTS;
const GET_CATEGORY_SERVER = import.meta.env.VITE_API_GET_CATEGORY_BY_ID;
const GET_USER_SERVER = import.meta.env.VITE_API_GET_USER_BY_ID;

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

    const token = localStorage.getItem('token');
    const requesterId = localStorage.getItem('userId');

    const productsWithDetails = await Promise.all(responseData.products.map(async (product) => {
      let user = { firstName: 'No se pudo obtener', lastName: 'información' };
      try {
        const userResponse = await fetch(`${GET_USER_SERVER}/${product.userId}?token=${token}&requesterId=${requesterId}`);
        if (userResponse.ok) {
          user = await userResponse.json();
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }

      let category = { name: 'No se pudo obtener información' };
      if (product.category_id) {
        try {
          const categoryResponse = await fetch(`${GET_CATEGORY_SERVER}/${product.category_id}`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            category = categoryData.category;
          }
        } catch (error) {
          console.error('Failed to fetch category details:', error);
        }
      }

      return { ...product, user, category };
    }));

    return productsWithDetails;
  } catch (error) {
    throw error;
  }
};

const debounce = (callback, wait) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      callback(...args);
    }, wait);
  };
};

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
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

  const debouncedSearch = useCallback(debounce((term) => {
    setSearchTerm(term);
  }, 300), []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    debouncedSearch(inputValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      debouncedSearch(inputValue);
    }
  };

  const handleSidebarSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredProducts = searchTerm
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  const convertBinaryToImageSrc = (binaryData) => {
    return `data:image/jpeg;base64,${btoa(binaryData)}`;
  };

  const handleProductClick = (productId) => {
    navigate(`/marketplace/product-detail/${productId}`);
  };

  return (
    <>
      <section className="relative block h-[11vh] bg-black">
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <div className="flex flex-col lg:flex-row h-screen bg-white text-black">
        <Sidebar onSearch={handleSidebarSearch} />
        <main className="flex-1 p-6 bg-white bg-opacity-75">
          <div className="lg:hidden flex justify-between mb-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar en Marketplace"
                className="w-full p-2 pl-10 rounded-full bg-gray-700 text-white focus:outline-none"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
              <MagnifyingGlassIcon
                className="absolute left-3 top-2.5 h-5 w-5 text-white cursor-pointer"
                onClick={handleSearchClick}
              />
            </div>
            <button
              className="ml-4 py-2 px-4 bg-gradient-to-r from-gray-300 to-gray-500 text-black rounded hover:from-gray-400 hover:to-gray-600"
              onClick={() => navigate('/marketplace/CreateProduct')}
            >
              + Crear publicación
            </button>
          </div>
          <section className="mb-6">
    
            
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Destacados de hoy</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-200 p-4 rounded text-left text-black shadow-lg cursor-pointer"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img
                    src={convertBinaryToImageSrc(product.image_data)}
                    alt={product.name}
                    className="mb-4 rounded h-48 w-full object-cover"
                  />
                  <p className="font-bold text-lg">{product.price} $</p>
                  <p className="truncate">{product.name}</p>
                  <p className="text-sm">{product.user.firstName} {product.user.lastName}</p> {/* Display user's full name */}
                  <p className="text-sm">{product.category.name}</p> {/* Display category name */}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
      <FloatingButton />
    </>
  );
};

export default Marketplace;
export { Marketplace };