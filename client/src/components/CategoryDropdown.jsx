import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryDropdown = ({ onChange }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories');
        setCategories(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false); 
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    onChange(e.target.value); 
  };

  return (
    <div className="form-group">
      <label htmlFor="categoryDropdown">Category</label>
      {loading ? (
        <p>Loading categories...</p> 
      ) : (
        <select id="categoryDropdown" onChange={handleCategoryChange} required>
          <option value="">Select a category</option> 
          {categories.map((category) => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName} 
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CategoryDropdown;
