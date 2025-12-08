import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { MainPage } from "./MainPage/MainPage";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { ProtectedRoute } from "./Utils/ProtectedRoute";
import { UserAdministration } from "./UserAdministration/UserAdministration";
import { AdminRoute } from "./Utils/AdminRoute";

export const AppRoutes = () => {
    return (
        <Router basename="/AtmosInsight">
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <MainPage/> 
                        </ProtectedRoute>
                    } 
                />
                
                <Route 
                    path="/UserAdmin" 
                    element={
                        <AdminRoute>
                            <UserAdministration/> 
                        </AdminRoute>
                    } 
                />
                <Route path="/Login" element={<Login/>} />
                <Route path="/Register" element={<Register/>} />
            </Routes>
        </Router>
    )
}