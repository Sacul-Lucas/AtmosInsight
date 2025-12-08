import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
    children,
}) => {
    const token = localStorage.getItem("token");
    
    if (!token) return <Navigate to="/Login" replace />;
    
    const decoded = jwtDecode<{ role: string }>(token);
    
    if (decoded.role !== "admin") {
      return <Navigate to="/Forbidden" replace />;
    }
  
    return children;
};