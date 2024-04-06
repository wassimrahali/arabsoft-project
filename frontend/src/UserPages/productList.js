import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn, MDBRipple } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from '../Components/Footer'
import '../ForgetPassword/ForgetPassword'
import '../index.css'
import Navbar from '../Components/Dashboard/Header'
const ProductList = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <>
    <Navbar />
    <div className="container">
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4 mb-4">
            <MDBCard>
              <MDBRipple rippleColor='light' rippleTag='div' className='bg-image hover-overlay'>
                <MDBCardImage width="80%" src={`http://localhost:8000/${product.image}`} fluid alt={product.name} />
                <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
              </MDBRipple>
              <MDBCardBody>
                <MDBCardTitle>{product.name}</MDBCardTitle>
                <MDBCardText>{product.detail}</MDBCardText>
                <Link to={`/products/${product._id}`}>
                  <button className='view-detail'>View Details</button>
                </Link>
              </MDBCardBody>
            </MDBCard>
          </div>
        ))}
      </div>
    </div>
    <Footer />

    </>
  );
};

export default ProductList;
