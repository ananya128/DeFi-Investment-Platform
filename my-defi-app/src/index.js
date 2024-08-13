import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import authConfig from './auth_config.json';

const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.returnTo
      ? appState.returnTo
      : window.location.pathname
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={authConfig.domain}
    clientId={authConfig.clientId}
    authorizationParams={{
      audience: authConfig.audience,
      redirect_uri: window.location.origin,
      scope: "openid profile email read:current_user update:current_user_metadata",
    }}
    useRefreshTokens={true}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>
);
