import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = ({ className }) => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ returnTo: window.location.origin })}
      className={className}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
