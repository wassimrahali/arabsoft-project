import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './SideBar-Admin/Sidebar';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [chart, setChart] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservationsResponse = await axios.get('http://localhost:8000/get-all-reservations');
        setReservations(reservationsResponse.data.reservations);

        const usersResponse = await axios.get('http://localhost:8000/api/admin/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateProductStats = () => {
      const productCounts = reservations.reduce((counts, reservation) => {
        counts[reservation.productName] = (counts[reservation.productName] || 0) + 1;
        return counts;
      }, {});

      const labels = Object.keys(productCounts);
      const data = Object.values(productCounts);
      const backgroundColor = labels.map(() => generateColor());

      setProductStats({ labels, data, backgroundColor });
    };

    calculateProductStats();
  }, [reservations]);
  useEffect(() => {
    if (!users.length) return;
  
    const userCountsByDate = {};
    users.forEach(user => {
      const createdAtDate = new Date(user.createdAt).toLocaleDateString();
      userCountsByDate[createdAtDate] = (userCountsByDate[createdAtDate] || 0) + 1;
    });
  
    const chartData = {
      labels: Object.keys(userCountsByDate),
      datasets: [{
        label: 'Number of Users',
        data: Object.values(userCountsByDate),
        backgroundColor: Object.keys(userCountsByDate).map(() => generateColor()), // Random colors
        borderWidth: 1,
        borderRadius: 10, // Round corners
        barPercentage: 0.6, // Adjust the width of the bars
      }]
    };
  
    const ctx = document.getElementById('enterpriseChart');
    if (!ctx) {
      console.error("Canvas element 'enterpriseChart' not found.");
      return;
    }
  
    if (chart) {
      chart.destroy();
    }
  
    setChart(new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Users'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Creation Date'
            }
          }
        }
      }
    }));
  
    return () => {
      if (chart) {
        chart.destroy();
      }
    };
  }, [users]);
  
  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 30); // 70-100%
    const lightness = 40 + Math.floor(Math.random() * 20); // 40-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/admin/user/${userId}`);

      if (response.data.message === 'User deleted successfully') {
        setUsers(users.filter(user => user._id !== userId));
        setAlert({
          type: 'success',
          message: 'User deleted successfully!',
        });
      } else {
        console.error('Error deleting user:', response.data.error);
        setAlert({
          type: 'danger',
          message: 'Error deleting user. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({
        type: 'danger',
        message: 'Error deleting user. Please try again.',
      });
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `${context.parsed}%`;
            }
            return label;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="admin-dashboard">
        <Sidebar />
        <div className="content" style={{ color: 'black' }}>

          {alert && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setAlert(null)}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}

          <div className="row">
          <div className="col-md-6">
              <div className="card" style={{width:'700px'}} >
                <div className="card-header">
                  <h5 className="card-title">Statistiques Des Clients</h5>
                </div>
                <div className="card-body" >
                  <div className="chart-container" >
                    <canvas id="enterpriseChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="card" style={{marginLeft:'150px'}}>
                <div className="card-header">
                  <h5 className="card-title">Statistiques des réservations</h5>
                </div>
                <div className="card-body">
                  <div className="chart-container">
                    <Pie
                      data={{
                        labels: productStats.labels || [],
                        datasets: [{
                          data: productStats.data || [],
                          backgroundColor: productStats.backgroundColor || [],   
                          hoverOffset: 4,
                        }],
                      }}
                      options={options}
                    />
                  </div>
                </div>
              </div>
            </div>

         
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
