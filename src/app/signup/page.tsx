// pages/signup.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";
import { API_ENDPOINTS } from "@/shared/apiConstants";
import { Alert } from "@mui/material";
import { useState } from "react";

const Signup = () => {
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [signupFail, setSignupFail] = useState(false);
    const [message, setMessage] = useState('');

    const handleSignup = async (formData: never) => {
        try {
            const response = await fetch(API_ENDPOINTS.SIGNUP_URL, {
                method: 'POST',
                headers: { 'identifier': 'staging' },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                setSignupSuccess(true);
                setSignupFail(false);
                setMessage('');
            } else {
                setSignupSuccess(false);
                setSignupFail(true);
                setMessage(data.message);
            }
            console.log(data);
            return data;
        } catch (error) {
            console.error('Signup error:', error);
            setSignupSuccess(false);
            setSignupFail(true);
            setMessage('An error occurred during sign-up. Please try again.');
        }
    };

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