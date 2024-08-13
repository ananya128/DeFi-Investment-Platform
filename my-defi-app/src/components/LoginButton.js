import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = ({ className }) => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = () => {
    loginWithRedirect({
      screen_hint: 'signup',
      authorizationParams: {
        audience: 'https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/',
        scope: 'openid profile email read:users update:users update:current_user_metadata offline_access',
        prompt: 'consent',
      },
    });
  };

  return (
    <div>
      <button
        onClick={() => loginWithRedirect({
          audience: 'https://dev-b3clsyr1vtq0iuvi.us.auth0.com/api/v2/',
          scope: 'openid profile email read:users update:current_user_metadata update:users offline_access',
          prompt: 'consent',
        })}
        className={className}
      >
        Log In
      </button>
      <button
        onClick={handleSignUp}
        className={className}
      >
        Sign Up
      </button>
    </div>
  );
};

export default LoginButton;
