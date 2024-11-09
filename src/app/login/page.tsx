// app/login/page.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";
import { Loader } from "@/components/Loader/Loader";
import { API_ENDPOINTS } from "@/shared/apiConstants";
import { postValidate } from "@/shared/util/apiService";
import Alert from '@mui/material/Alert';
import { useState } from "react";

const LoginPage = () => {
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (formData: FormData) => {

        setLoading(true); // Set loading to true before starting the API call

        try {
            const result = await postValidate(API_ENDPOINTS.LOGIN_URL, formData);
            if (result.success) {
                setLoginSuccess(true);
                setLoginFail(false);
                setMessage('');
            } else {
                setLoginSuccess(false);
                setLoginFail(true);
                setMessage(result.message || '');
            }
        } catch (error) {
            console.error('Login Error:', error);
            setLoginSuccess(false);
            setLoginFail(true);
            setMessage('An error occurred during login. Please try again.');
        } finally {
            setLoading(false); // Set loading to false once the API call completes
        }
    };

    if (loading) return <Loader />

    return (
        <div>
            {loginSuccess && (
                <Alert severity="success" onClose={() => { setLoginSuccess(false) }}>
                    Login Successful
                </Alert>
            )}
            {loginFail && (
                <Alert severity="error" onClose={() => { setLoginFail(false) }}>
                    {message}
                </Alert>
            )}
            <AuthForm isLogin={true} onSubmit={handleLogin} success={loginSuccess} message={message} />
        </div>
    );
};

export default LoginPage;