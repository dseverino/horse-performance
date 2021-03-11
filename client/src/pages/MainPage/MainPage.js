import React from 'react';
import App from '../../App';
import AuthContextProvider from '../../context/auth-context';

const MainPage = () => {
  return (
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  );
};

export default MainPage;