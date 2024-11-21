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

                localStorage.setItem('loginData', JSON.stringify(result.data.data));
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.removeItem('selectedAreaWithOption');

                handleGoBack();
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

    const handleGoBack = () => {
        const previousPage = document.referrer; // Get the previous page URL
        if (previousPage) {
            window.history.back(); // Go back in history if there's a referrer
        } else {
            window.location.href = '/'; // Redirect to home page if no referrer
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