import React, {useState, useEffect} from "react";
import {Route, Routes} from 'react-router-dom'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
import Idps from "./Pages/Idps";
import Sps from "./Pages/Sps";
import Sp from "./Pages/Sps/sp";
import Idp from "./Pages/Idps/idp";
import Login from "./Pages/Authentication/Login";
import "./app.css";
import "./style.scss";
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import {
  languageContext,
  tenantContext,
  envContext,
  userinfoContext
} from "./Context/context";
import Layout from "./components/Common/layout";
import SideNav from "./components/Common/sideNav";
import Main from "./components/Common/main";
import {ToastContainer} from "react-toastify";
import ErrorPage from "./Pages/Error";
import {useCookies} from 'react-cookie';
import {toast} from 'react-toastify';
import Middleware from "./components/Common/middleware"


function App() {
  const [language, setLanguage] = useState('en')
  const [tenantCon, setTenantCon] = useState(null)
  const [envCon, setEnvCon] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [cookies, setCookie] = useCookies();


  useEffect(() => {
    if (cookies.userinfo != undefined) {
      setUserInfo(jwt_decode(cookies.userinfo))
    }
  }, [cookies])

  useEffect(() => {
    if (userInfo != undefined) {
      toast.info(`Welcome ${userInfo.name}`)
    }
  }, [userInfo])

  return (
    <languageContext.Provider value={[language, setLanguage]}>
      <tenantContext.Provider value={[tenantCon, setTenantCon]}>
        <envContext.Provider value={[envCon, setEnvCon]}>
          <userinfoContext.Provider value={[userInfo, setUserInfo]}>
            <Layout>
              <SideNav></SideNav>
              <Main>
                <AppRoutes/>
              </Main>
              <ToastContainer
                position="bottom-left"
                autoClose={false}
                closeOnClick
                rtl={false}
                pauseOnHover
              />
            </Layout>
          </userinfoContext.Provider>
        </envContext.Provider>
      </tenantContext.Provider>
    </languageContext.Provider>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/:tenant/:environment" element={<Middleware elementName={Dashboard}/>}/>
      <Route path="/:tenant/:environment/communities" element={<Middleware elementName={Communities}/>}/>
      <Route path="/:tenant/:environment/users" element={<Middleware elementName={Users}/>}/>
      <Route path="/:tenant/:environment/identity-providers" element={<Middleware elementName={Idps}/>}/>
      <Route path="/:tenant/:environment/services" element={<Middleware elementName={Sps}/>}/>
      <Route path="/:tenant/:environment/identity-providers/:id" element={<Middleware elementName={Idp}/>}/>
      <Route path="/:tenant/:environment/services/:id" element={<Middleware elementName={Sp}/>}/>
      <Route path="/login" element={<Middleware elementName={Login}/>}/>
      <Route path="*" element={<Middleware elementName={ErrorPage}/>}/>
    </Routes>
  )
}

export default App;