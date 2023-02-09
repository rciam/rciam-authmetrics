import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/Error";
import {QueryClient, QueryClientProvider} from 'react-query'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import Dashboard from "./Pages/Dashboard";
// import Idps from "./Pages/Idps";
// import Sps from "./Pages/Sps";
import "./app.css";

function App() {
    // const queryClient = new QueryClient()
    return (
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
                    
                    <Route path="/sps" element={<Sps/>}/> */}
                    <Route path="/:project/:environment" element={<Dashboard/>}/>
                    <Route path="/:project/:environment/communities" element={<Communities/>}/>
                    <Route path="/:project/:environment/users" element={<Users/>}/>
                    {/* <Route path="/:project/:environment/idps" element={<Idps/>}/>
                    <Route path="/:project/:environment/sps" element={<Sps/>}/> */}
                </Routes>
            {/* </QueryClientProvider> */}
        </Router>
    );
}

export default App;