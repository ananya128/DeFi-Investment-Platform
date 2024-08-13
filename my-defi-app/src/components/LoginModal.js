import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LoginModal.css';

const LoginModal = ({ showModal, setShowModal }) => {
  const { loginWithRedirect } = useAuth0();

  const handleClose = () => setShowModal(false);

  const handleLogin = () => {
    loginWithRedirect();
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="close-btn" onClick={handleClose}>&times;</div>
        <div className="modal-content">
          <div className="avatar">
            <img src="http://remtsoy.com/experiments/user_card/img/avatar.jpg" alt="Avatar" />
          </div>
          <div className="modal-inner">
            <h3 className="name">Welcome Back!</h3>
            <h4 className="occupation">Please log in to continue</h4>
            <button className="login-btn" onClick={handleLogin}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
