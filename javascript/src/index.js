import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {UserProvider} from "./Context/UserProvider";

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <UserProvider>
      <App/>
      <ToastContainer
        position="bottom-left"
        autoClose={false}
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </UserProvider>
  </React.StrictMode>
)