// app/login/page.js
'use client'
import AuthForm from "@/components/AuthForm/AuthForm";

const LoginPage = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return <AuthForm isLogin={true} onSubmit={handleLogin} />;
};

export default LoginPage;