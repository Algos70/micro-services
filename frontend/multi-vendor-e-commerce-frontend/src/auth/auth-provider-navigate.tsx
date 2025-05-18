import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithNavigate = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE!;

  console.log('Auth0 Domain:', import.meta.env.VITE_AUTH0_DOMAIN);
  console.log('Auth0 Client ID:', import.meta.env.VITE_AUTH0_CLIENT_ID);
  console.log('Auth0 Audience:', import.meta.env.VITE_AUTH0_AUDIENCE);

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
      onRedirectCallback={(appState: { returnTo?: string } | undefined) => {
        navigate(appState?.returnTo || '/dashboard'); // Redirect to /dashboard by default
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
