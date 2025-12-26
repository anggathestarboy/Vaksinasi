import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedLogin = ({children}) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const validasi = async () => {
        if (token) {
            navigate("/dashboard");
        }


    
    };



    useEffect(() => {
        validasi();
    }, []);


    return children;
};

export default ProtectedLogin;
