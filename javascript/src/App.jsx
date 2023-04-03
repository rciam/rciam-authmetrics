import { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/Error";
import { QueryClient, QueryClientProvider } from 'react-query'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Idps from "./Pages/Idps";
import Sps from "./Pages/Sps";
import Sp from "./Pages/Sps/sp";
import Idp from "./Pages/Idps/idp";
import "./app.css";
import "./style.scss";

import { languageContext, projectContext, envContext } from "./components/Common/context";
import Layout from "./components/Common/layout";
import SideNav from "./components/Common/sideNav";
import Main from "./components/Common/main";
import { useParams } from "react-router-dom";
function App() {
    // const queryClient = new QueryClient()
    const [language, setLanguage] = useState('en');
    const [projectCon, setProjectCon] = useState(null);
    const [envCon, setEnvCon] = useState(null)
    return (
        <languageContext.Provider value={[language, setLanguage]}>
            <projectContext.Provider value={[projectCon, setProjectCon]}>
                <envContext.Provider value={[envCon, setEnvCon]}>
                    <Layout>
                        <SideNav></SideNav>
                        <Main>
                            <Router>
                                {/* <QueryClientProvider client={queryClient}> */}
                                <Routes>
                                    {/* <Route path="/login" element={<Login/>}/> */}
                                    <Route path="/:project/:environment" element={<Dashboard />} />
                                    <Route path="/:project/:environment/communities" element={<Communities />} />
                                    <Route path="/:project/:environment/users" element={<Users />} />
                                    <Route path="/:project/:environment/idps" element={<Idps />} />
                                    <Route path="/:project/:environment/sps" element={<Sps />} />
                                    <Route path="/:project/:environment/idps/:id" element={<Idp />} />
                                    <Route path="/:project/:environment/sps/:id" element={<Sp />} />
                                </Routes>
                                {/* </QueryClientProvider> */}
                            </Router>
                        </Main>
                    </Layout>
                </envContext.Provider>
            </projectContext.Provider>
        </languageContext.Provider>
    );
}

export default App;