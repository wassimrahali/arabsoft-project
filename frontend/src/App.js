import React from 'react';
import {
    Routes,
    Route,
    BrowserRouter as Router,
    Navigate
} from 'react-router-dom';
import Signin from './Components/SigninPage/Signin.js';
import Signup from './Components/SignupPage/Signup.js';
import Home from './Home/Home.js';
import AdminUsers from './AdminPages/adminUsers.js';
import ProductList from './UserPages/productList.js';
import UpdateUserPage from './UserPages/UpdateUserPage.js';
import { isAuthenticated } from './Backend';
import ReservationForm from './UserPages/ReservationForm/ReservationForm.js';
import AdminReservationList from './AdminPages/AdminReservationList/AdminReservationList.js';
import NotFound from './Components/Notfound.js';
import ContactForm from './Contact-Form/Contact-Form.js'
import AjirDetails from './Components/ProductDetails/AjirDetails.js';
import Sidebar from './AdminPages/SideBar-Admin/Sidebar.js';
import AdminProduct from './AdminPages/AdminProduct.js';
import ResetPassword from './ForgetPassword/ResetPassword.js';
import ForgetPassword from './ForgetPassword/ForgetPassword.js';

function App() {
    const authenticatedUser = isAuthenticated(); // Check if the user is authenticated

    return (
        <div className='App'>
            {/* Setting up the Router component from react-router-dom */}
            <Router>
                {/* Defining different Routes using Routes and Route components */}
                <Routes>
                    <Route path='/submit' element={<ReservationForm />} />
                    <Route path='/' element={<Home />} />


                    {/* Route for the Home component */}
                    <Route path='/home' element={<Home />} />

                    {/* Route for the Signin component */}
                    <Route path='/signin' element={<Signin />} />

                    {/* Route for the Signup component */}
                    <Route path='/signup' element={<Signup />} />

                    {/* Route for the ProductList component */}
                    <Route path='/products' element={<ProductList />} />
                    <Route path="/products/:productId" element={<AjirDetails />} />

                    <Route path='/ajir' element={<AjirDetails />} />
                    <Route path='/reset-password/:id/:token' element={<ResetPassword />} />
                    <Route path='/forget' element={<ForgetPassword />} />

                    {/* Admin Routes */}
                    {authenticatedUser && authenticatedUser.user.role === 'admin' && (
                        <>
                            <Route path='/' element={<AdminUsers/>} />
                            <Route path='/users' element={<AdminUsers />} />
                            <Route path='/addproduct' element={<AdminProduct />} />
                            {/* <Route path='/submit' element={<Signin />} /> */}
                        </>
                    )}

                    {/* User Routes */}
                    {authenticatedUser && authenticatedUser.user.role !== 'admin' && (
                        <>
                            <Route path='/update' element={<UpdateUserPage />} />
                            <Route path='/submit' element={<ReservationForm />} />
                            <Route path='*' element={<NotFound />} />
                        </>
                    )}

                    {/* Redirect authenticated users to Home, and unauthenticated users to Signin */}
                    <Route
                        // path='*'
                        element={
                            authenticatedUser ? (
                                <Navigate to='/home' replace={true} />
                            ) : (
                                <Navigate to='/' replace={true} />
                            )
                        }
                    />

                    {/* 404 Not Found */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
