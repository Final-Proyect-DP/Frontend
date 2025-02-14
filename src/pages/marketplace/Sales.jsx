import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import FloatingButton from '../../components/FloatingButton';

const GET_USER_ITEMS_SERVER = import.meta.env.VITE_API_GET_USER_ITEMS;
const UPDATE_PRODUCT_SERVER = import.meta.env.VITE_API_UPDATE_PRODUCT;
const GET_CATEGORY_SERVER = import.meta.env.VITE_API_GET_CATEGORY;
const DELETE_PRODUCT_SERVER = import.meta.env.VITE_API_DELETE_PRODUCT;

const fetchUserItems = async (userId) => {
  try {
    const response = await fetch(`${GET_USER_ITEMS_SERVER}/${userId}`, {
      headers: {
        'accept': 'application/json'
      }
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return data.products; // Update to match the response structure
    } catch (error) {
      console.error('Error parsing JSON:', error);
      console.error('Response text:', text);
      throw new Error('Failed to parse JSON response');
    }
  } catch (error) {
    console.error('Error fetching user items:', error);
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(GET_CATEGORY_SERVER);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const updateProduct = async (id, updatedProduct) => {
  try {
    const response = await fetch(`${UPDATE_PRODUCT_SERVER}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    const data = await response.json();
    return data.product; // Update to match the response structure
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const response = await fetch(`${DELETE_PRODUCT_SERVER}/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

const Sales = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]); // Add categories state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', image: null, categoryId: '' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userItems = await fetchUserItems(userId);
        setItems(userItems);
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    };

    const fetchAllCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchItems();
    fetchAllCategories();
  }, [userId]);

  const convertBinaryToImageSrc = (binaryData) => {
    if (!binaryData) return ''; // Handle null image data
    return `data:image/jpeg;base64,${btoa(binaryData)}`;
  };

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setFormData({ name: item.name, price: item.price, description: item.description, image: null, categoryId: item.category_id });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteProduct(id);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found in local storage');
      return;
    }

    const updatedProduct = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      userId: userId,
      category_id: formData.categoryId,
    };

    if (formData.image) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        updatedProduct.image_data = reader.result.split(',')[1]; // Get base64 string
        console.log('Updated Product with Image:', updatedProduct); // Log the data being sent
        try {
          const updatedItem = await updateProduct(currentItem.id, updatedProduct);
          setItems((prevItems) =>
            prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
          );
          handleCloseModal();
        } catch (error) {
          console.error('Error updating product:', error);
        }
      };
      reader.readAsDataURL(formData.image);
    } else {
      console.log('Updated Product without Image:', updatedProduct); // Log the data being sent
      try {
        const updatedItem = await updateProduct(currentItem.id, updatedProduct);
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
        handleCloseModal();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  return (
    <>
      <section className="relative block h-[11vh] bg-black">
        <div className="absolute top-0 h-full w-full bg-black/60 bg-cover bg-center" />
      </section>
      <div className="flex flex-col lg:flex-row h-screen bg-white text-black">
        <Sidebar />
        <main className="flex-1 p-6 bg-white bg-opacity-75">
          <h1 className="text-2xl font-bold mb-6">Mis Ventas</h1>
          <div className="space-y-4">
            {items && items.map((item) => (
              <div key={item.id} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4">
                  <img
                    src={convertBinaryToImageSrc(item.image_data)}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-bold text-lg">{item.price} $</p>
                    <p className="text-md">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <div className="flex space-x-2 mt-2">
                      <button className="text-sm text-blue-500" onClick={() => handleEditClick(item)}>Editar</button>
                      <button className="text-sm text-blue-500" onClick={() => handleDeleteClick(item.id)}>Eliminar publicación</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <FloatingButton />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Precio</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="mt-2 w-24 h-24 rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sales;
export { Sales };