import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import { MainPage } from "./MainPage/MainPage";

export const AppRoutes = () => {
    return (
        <Router basename="/AtmosInsight">
            <Routes>
                <Route path="/" element={<MainPage/>} />
            </Routes>
        </Router>
    )
}