import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated) {
        return null;
    }

    return <RegisterForm />;
};

export default Register;
