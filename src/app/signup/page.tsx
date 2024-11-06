// pages/signup.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";

const Signup = () => {
    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic here
    };

    return <AuthForm isLogin={false} onSubmit={handleSignup} />;
};

export default Signup;