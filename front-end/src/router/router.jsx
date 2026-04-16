import React from "react";
import { Route, Routes } from 'react-router-dom'
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Registration from "../pages/Registration";
import InsertCode from "../pages/InsertCode";
import NotFound from "../pages/NotFound";

const Router = () => {
    return (
        <Routes>
            <Route index path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/insertCode" element={<InsertCode />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Router