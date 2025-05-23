import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRoutes from './routes/AppRoutes';
import './index.css';
import './app.css'

const App = () => {
  return (
    <Provider store={store}>
      <div className="app-container">
        <AppRoutes />
      </div>
    </Provider>
  );
};

export default App;