import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
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
                                    <Route path="/:project/:environment/identity-providers" element={<Idps />} />
                                    <Route path="/:project/:environment/services" element={<Sps />} />
                                    <Route path="/:project/:environment/identity-providers/:id" element={<Idp />} />
                                    <Route path="/:project/:environment/services/:id" element={<Sp />} />
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