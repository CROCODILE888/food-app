// pages/signup.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";
import { Loader } from "@/components/Loader/Loader";
import { API_ENDPOINTS } from "@/shared/apiConstants";
import { postValidate } from "@/shared/util/apiService";
import { Alert } from "@mui/material";
import { useState } from "react";

const Signup = () => {
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signupFail, setSignupFail] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const handleSignup = async (formData: FormData) => {
        setLoading(true);
        try {
            const result = await postValidate(API_ENDPOINTS.SIGNUP_URL, formData);
            if (result.success) {
                setSignupSuccess(true);
                setSignupFail(false);
                setMessage('');
            } else {
                setSignupSuccess(false);
                setSignupFail(true);
                setMessage(result.message || '');
            }
        } catch (error) {
            console.error("Error is signUp: ", error);
            setSignupSuccess(false);
            setSignupFail(true);
            setMessage('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }

    }
    if (loading) return <Loader />

    return (
        <div>
            {signupSuccess && (
                <Alert severity="success" onClose={() => setSignupSuccess(false)}>
                    Registered Successfully
                </Alert>
            )}
            {signupFail && (
                <Alert severity="error" onClose={() => setSignupFail(false)}>
                    {message}
                </Alert>
            )}
            <AuthForm isLogin={false} onSubmit={handleSignup} success={signupSuccess} message={message} />
        </div>
    );
};

export default Signup;