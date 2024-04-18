import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminRervationList.css";
import Slidebar from "../SideBar-Admin/Sidebar";
import Stat from "../Stat";
import Pagination from 'react-bootstrap/Pagination'; // Import pagination from Bootstrap

const AdminReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(5);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get("http://localhost:8000/get-all-reservations");
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        setError("Error fetching reservations. Please try again.");
      }
    };

    fetchReservations();
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    adresse: "",
    productId: "",
    entrepriseName: "",
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProductFilter = (e) => {
    setProductFilter(e.target.value);
  };

  const handleDateFilter = (date) => {
    const formattedDate = date ? date.toISOString().split("T")[0] : null;
    setDateFilter(formattedDate);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const searchFields = [
      reservation.name,
      reservation.email,
      reservation.phoneNumber,
      reservation.productName,
      reservation.enterpriseName,
      reservation.adresse,
      new Date(reservation.createdAt).toLocaleString(),
    ];

    return (
      searchFields.some(
        (field) =>
          field &&
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (productFilter === "" || reservation.productId === productFilter) &&
      (dateFilter === null ||
        new Date(reservation.createdAt).toISOString().split("T")[0] ===
          dateFilter)
    );
  });

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredReservations.length / reservationsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div>
      <div className="admin-reservation-list">
        <Slidebar />
        <div className="content-b">
          <div className="card" style={{ width: '95%', padding: '15px' }}>
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-list-alt"></i> Listes des reservations des Logicielles
              </h5>
            </div>
            <div className="search-container">
              <label htmlFor="search">Search:</label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Enter search query"
              />
            </div>
            <div className="filter-container">
              <label>
                Product:
                <select
                  name="productId"
                  value={productFilter}
                  onChange={handleProductFilter}
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option
                      key={product._id}
                      value={product._id}
                      style={{ color: "black" }}
                    >
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="filter-container">
              <label htmlFor="dateFilter">Filter by Date:</label>
              <DatePicker
                id="dateFilter"
                selected={dateFilter}
                onChange={handleDateFilter}
                placeholderText="Select a date"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            {currentReservations.length === 0 ? (
              <p>No matching reservations.</p>
            ) : (
              <table className="reservation-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Product Name</th>
                    <th>Enterprise Name</th>
                    <th>Address</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>{reservation.name}</td>
                      <td>{reservation.email}</td>
                      <td>{reservation.phoneNumber}</td>
                      <td>{reservation.productName}</td>
                      <td>{reservation.entrepriseName}</td>
                      <td>{reservation.adresse}</td>
                      <td>{new Date(reservation.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Pagination */}
          <Pagination>
            <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
            {Array.from({ length: Math.ceil(filteredReservations.length / reservationsPerPage) }, (_, i) =>
              <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                {i + 1}
              </Pagination.Item>
            )}
            <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredReservations.length / reservationsPerPage)} />
          </Pagination>
          <Stat />
        </div>
      </div>
    </div>
  );
};

export default AdminReservationList;
