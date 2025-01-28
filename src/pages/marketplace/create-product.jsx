import React, { useState } from 'react';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null,
  });

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

    try {
      const response = await fetch('http://localhost:8080/items', {
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
export {CreateProduct};