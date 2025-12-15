import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { Dashboard } from "./Dashboard/Dashboard";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { ProtectedRoute } from "./Utils/ProtectedRoute";
import { Administration } from "./Administration/Administration";
import { AdminRoute } from "./Utils/AdminRoute";
import { Landing } from "./Landing/Landing";

export const AppRoutes = () => {
    return (
        <Router basename="/AtmosInsight">
            <Routes>
                <Route 
                    path="/Dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard/> 
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/Administration" 
                    element={
                        <AdminRoute>
                            <Administration/> 
                        </AdminRoute>
                    } 
                />
                <Route path="/" element={<Landing/>} />
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} />
            </Routes>
        </Router>
    )
}