import "./app.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ErrorPage from "./Pages/Error";
import {QueryClient, QueryClientProvider} from 'react-query'
import Communities from "./Pages/Communities";
import Users from "./Pages/Users";
import RegisteredUsers from "./Pages/RegisteredUsers";

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
                    <Route path="/" element={<Communities/>}/> 
                    <Route path="/communities" element={<Communities/>}/>
                    <Route path="/users" element={<Users/>}/>
                </Routes>
            {/* </QueryClientProvider> */}
        </Router>
    );
}

export default App;