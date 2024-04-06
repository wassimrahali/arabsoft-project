
// components
import Dashboard from '../Components/Dashboard/Header'
import CarouselHome from "./Carousel-Home"
import PackingSolutionleft from './Body-Section-Home'
import ProductHomeCard from '../Contact-Form/Product-Home-Card'
import Footer from '../Components/Footer'
import AjirDetails from '../Components/ProductDetails/AjirDetails'
const Home = () => {



  return (
    <div className="home">
      <Dashboard />
      {/* <AjirDetails /> */}
      <CarouselHome />
      <PackingSolutionleft />
      <ProductHomeCard />
      <Footer />
      
    
     
      
   

    </div>
  )
}

export default Home