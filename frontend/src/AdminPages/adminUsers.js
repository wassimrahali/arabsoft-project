import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './SideBar-Admin/Sidebar';
import './AdminReservationList/AdminRervationList.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'react-bootstrap/Pagination'; // Importer la pagination de Bootstrap
import Modal from 'react-bootstrap/Modal'; // Importer la modal de Bootstrap

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Nombre d'utilisateurs par page
  const [selectedUserId, setSelectedUserId] = useState(null); // ID de l'utilisateur sélectionné pour la suppression
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // État de la modal de confirmation

  useEffect(() => {
    // Récupérer les utilisateurs lorsque le composant est monté
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      // Effectuer une requête DELETE pour supprimer l'utilisateur
      const response = await axios.delete(`http://localhost:8000/api/admin/user/${selectedUserId}`);

      if (response.data.message === 'User deleted successfully') {
        // Si la suppression réussit, mettre à jour l'état des utilisateurs
        setUsers(users.filter(user => user._id !== selectedUserId));

        // Afficher une alerte de succès
  

        // Masquer l'alerte de succès après 3 secondes
        setTimeout(() => setAlert(null), 3000);
      } else {
        console.error('Erreur lors de la suppression de l\'utilisateur :', response.data.error);

        // Afficher une alerte d'erreur
        setAlert({
          type: 'danger',
          message: 'Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);

      // Afficher une alerte d'erreur
      setAlert({
        type: 'danger',
        message: 'Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.',
      });
    }

    // Cacher la modal de confirmation
    setShowConfirmationModal(false);
  };

  // Index du dernier utilisateur de la page actuelle
  const indexOfLastUser = currentPage * usersPerPage;
  // Index du premier utilisateur de la page actuelle
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Utilisateurs de la page actuelle
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Aller à la page précédente
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Aller à la page suivante
  const goToNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <div className="admin-reservation-list">
        <Sidebar />

        <div className="content-b" style={{ color: 'black' }}>
          <div className="card" style={{ width: '95%', padding: '15px' }}>
            <div className="card-header">
              <h5 className="card-title">
                <i className="fas fa-users" /> Gestion Des utilisateurs
              </h5>
            </div>

            {/* Bootstrap Alert */}
            {alert && (
              <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setAlert(null)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Entreprise Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers
                  .filter(user => user.role !== 'admin') // Filtrer les utilisateurs avec le rôle 'admin'
                  .map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{user.enterpriseName}</td>
                      <td>
                        <button onClick={() => { setSelectedUserId(user._id); setShowConfirmationModal(true); }} style={{ backgroundColor:"#3E97FF", padding: "15px",}}>
                          <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination>
              <Pagination.Prev onClick={goToPrevPage}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </Pagination.Prev>
              {Array.from({length: Math.ceil(users.length / usersPerPage)}, (_, i) => 
                <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => paginate(i+1)}>
                  {i+1}
                </Pagination.Item>
              )}
              <Pagination.Next onClick={goToNextPage}>
                <FontAwesomeIcon icon={faArrowRight} />
              </Pagination.Next>
            </Pagination>
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet utilisateur ?
        </Modal.Body>
        <Modal.Footer>
          <button style={{ backgroundColor:"#3E97FF", padding: "15px",}}onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </button>
          <button style={{ backgroundColor:"#E73744", padding: "15px",}} variant="danger" onClick={handleDelete}>
            Supprimer
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminPage;
