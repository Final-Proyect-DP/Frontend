import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GET_CATEGORY_SERVER = import.meta.env.VITE_API_GET_CATEGORY;
const CREATE_PRODUCT_SERVER = import.meta.env.VITE_API_CREATE_PRODUCT;

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${GET_CATEGORY_SERVER}`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          throw new Error('Categories data is not an array');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found in local storage');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('userId', userId);
    formDataToSend.append('image', formData.image);
    formDataToSend.append('category_id', formData.categoryId);

    console.log('Form Data:', {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      userId: userId,
      image: formData.image,
      category_id: formData.categoryId,
    });

    try {
      const response = await fetch(`${CREATE_PRODUCT_SERVER}`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      alert('Product created successfully');
      // Optionally, redirect or clear the form
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error creating product');
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="flex h-screen bg-black text-gold pt-20">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Crear Publicación</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded">
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="name">Nombre del Producto</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="price">Precio</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="categoryId">Categoría</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              required
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
            <label className="block text-white mb-2" htmlFor="image">Imagen</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 rounded bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-gold text-black rounded hover:bg-yellow-500"
          >
            Crear Publicación
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
export { CreateProduct };