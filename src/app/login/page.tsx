// app/login/page.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";
import { API_ENDPOINTS } from "@/shared/apiConstants";
import Alert from '@mui/material/Alert';
import { useState } from "react";

const LoginPage = () => {
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [message, setMessage] = useState('');

    const handleLogin = async (formData: never) => {
        try {
            const response = await fetch(API_ENDPOINTS.LOGIN_URL, {
                method: 'POST',
                headers: { 'identifier': 'staging' },
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setLoginSuccess(true);
                setLoginFail(false);
                setMessage('');
            } else {
                setLoginSuccess(false);
                setLoginFail(true);
                setMessage(data.message);
            }
            console.log(data);
            return data;
        } catch (error) {
            setLoginSuccess(false);
            setLoginFail(true);
            setMessage('An error occurred during login. Please try again.')
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            {loginSuccess && <Alert severity="success" onClose={() => { setLoginSuccess(false) }}>Login Successful</Alert>}
            {loginFail && <Alert severity="error" onClose={() => { setLoginFail(false) }}>{message}</Alert>}
            <AuthForm isLogin={true} onSubmit={handleLogin} success={loginSuccess} message={message} />
        </div>
    );
};

export default LoginPage;