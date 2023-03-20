import { useState, useContext, useEffect } from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/Error";
import {QueryClient, QueryClientProvider} from 'react-query'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Idps from "./Pages/Idps";
// import Sps from "./Pages/Sps";
import Idp from "./Pages/Idps/idp";
import "./app.css";
import "./style.scss";

import { languageContext } from "./components/Common/context";
import Layout from "./components/Common/layout";
import SideNav from "./components/Common/sideNav";
import Main from "./components/Common/main";

function App() {
    // const queryClient = new QueryClient()
    const [language,setLanguage]= useState('en');

    return (
        <languageContext.Provider value={[language, setLanguage]}>
            <Layout>
            <SideNav></SideNav>
            <Main>
            <Router>
                {/* <QueryClientProvider client={queryClient}> */}
                    <Routes>
                        {/* <Route path="/login" element={<Login/>}/> */}
                        {/* <Route path="/register" element={<Register/>}/> */}
                        {/* <Route path="/" element={<Login/>}/> */}
                        {/* <Route path="*" element={<ErrorPage/>}/> */}
                        {/* <Route path="/" element={<Dashboard/>}/> 
                        <Route path="/communities" element={<Communities/>}/>
                        <Route path="/users" element={<Users/>}/>
                        */}
                        <Route path="/:project/:environment" element={<Dashboard/>}/>
                        <Route path="/:project/:environment/communities" element={<Communities/>}/>
                        <Route path="/:project/:environment/users" element={<Users/>}/>
                        <Route path="/:project/:environment/idps" element={<Idps/>}/>
                        {/* <Route path="/:project/:environment/sps" element={<Sps/>}/> */}
                        <Route path="/:project/:environment/idps/:id" element={<Idp/>}/>
                    </Routes>
                {/* </QueryClientProvider> */}
            </Router>
            </Main>
            </Layout>
        </languageContext.Provider>
    );
}

export default App;