// ReservationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Components/SigninPage/signin.css';
import Dashboard from '../../Components/Dashboard/Header';
import './ReservationForm.css';
import Footer from '../../Components/Footer';
import Reservationphoto from '../../assets/ReservationPhoto.jpg'

const ReservationForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    detail: '',
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/all');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    adresse: '',
    productId: '', // Assuming you have a product ID
  });

  const [products, setProducts] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/reservations', formData);

      // Show success alert
      setShowSuccessAlert(true);

      // Optionally, you can handle success or redirect the user
      console.log('Reservation submitted successfully');
    } catch (error) {
      console.error('Error submitting reservation:', error);
    }
  };
  return (
    <div className="reservation-form-container">
    <Dashboard />
                <img src={Reservationphoto} className='reservationImg'  />

   
    

      <h2 className='titre-form'>Pour Réserver Remplire Cette Formulaire</h2>
      <form  onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </label>

        <br />
        <label>
          Entreprise Name:
          <input type="text" name="entrepriseName" value={formData.entrepriseName} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Address:
          <input type="text" name="adresse" value={formData.adresse} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Product:
          <select name="productId" value={formData.productId} onChange={handleChange} required>
            <option value="" disabled>Select a product</option>
            {products.map((product) => (
                 <option key={product._id} value={product._id} style={{ color: 'black' }}>
                 {product.name}
               </option>
            ))}
          </select>
        </label>
        <br />
        {showSuccessAlert && (
        <div className="alert alert-success" role="alert">
          Reservation submitted successfully!
        </div>
      )}
        <button type="submit">Submit Reservation</button>

     
      </form>

      <Footer />

    
   </div>
  );
};

export default ReservationForm;
