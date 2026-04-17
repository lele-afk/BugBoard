import React from "react";
import { Route, Routes } from 'react-router-dom'
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import Registration from "../pages/Registration";
import NotFound from "../pages/NotFound";
import VerificationCode from "../pages/VerificationCode";

const Router = () => {
    return (
        <Routes>
            <Route index element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/registration" element={<Registration />} />
            <Route path='/verificationCode' element={<VerificationCode />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Router