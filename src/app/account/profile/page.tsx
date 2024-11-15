// app/account/profile/page.js
'use client'

import { useEffect, useState } from 'react';
// import styles from './profile.module.css';

const Profile = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setUserName(loginData.customer.name || ''); // Assuming 'name' is the key in your login response
        }
    }, []);

    return (
        <h1>Profile page for {userName}</h1>
    )
}

export default Profile