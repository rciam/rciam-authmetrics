import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {UserProvider} from "./Context/UserProvider";

import {BrowserRouter as Router, Route, Link, Routes} from "react-router-dom";
import Communities from './Pages/Communities';

const container = document.getElementById('root')
const root = ReactDOM.createRoot(container)

root.render(
    <div className="app">
            <App/>
    </div>
)

//   <React.StrictMode>
//     <UserProvider>
//       <App/>
//       <ToastContainer
//         position="bottom-left"
//         autoClose={false}
//         closeOnClick
//         rtl={false}
//         pauseOnHover
//       />
//     </UserProvider>
//   </React.StrictMode>