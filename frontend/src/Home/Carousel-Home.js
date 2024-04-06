import React from 'react';
import '../Contact-Form/Contact.css';
import Carousel from 'react-bootstrap/Carousel';
import img1 from '../assets/images/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';

function CarouselHome() {
  return (
    <Carousel data-bs-theme="white">
      <Carousel.Item>
        <img className="d-block w-100" src={img1} alt="First slide" />
        <Carousel.Caption className="text-white">
          <h5>Découvrez nos logiciels Entreprise Management pour chaque secteur d’activité</h5>
          <p></p>
          <button className="contact-button-1">View More</button>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={img2} alt="Second slide" />
        <Carousel.Caption className="text-white">
          <h5>Second slide label</h5>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <button className="contact-button-4">View More</button>

        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={img3} alt="Third slide" />
        <Carousel.Caption className="text-white">
          <h5>Third slide label</h5>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          <button className="contact-button-3">View More</button>

        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselHome;
