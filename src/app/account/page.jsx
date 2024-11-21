// app/account/page.js
'use client'

import { useState, useEffect } from 'react';
import styles from './account.module.css';
import Link from 'next/link';
import { logout } from '@/shared/util/apiService';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

const Account = () => {

    const [linkHref, setLinkHref] = useState('/login');
    const [loginData, setLoginData] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            setLinkHref('/account/profile')
            setIsLoggedIn(true);
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setLoginData(loginData);
        }
    }, []);

    const [whatsAppLink, setWhatsAppLink] = useState('');
    useEffect(() => {
        const initialData = localStorage.getItem('initialData');
        if (initialData) {
            const parsedInitialData = JSON.parse(initialData);
            const whatsAppNumber = parsedInitialData?.organization?.configurations?.general?.whatsapp_number; // Adjust this key if it differs

            if (whatsAppNumber) {
                const formattedWhatsAppLink = `https://wa.me/${whatsAppNumber}`;
                setWhatsAppLink(formattedWhatsAppLink);
            }
        }
    }, []);

    const handleLogout = async () => {

        const result = await logout(loginData.id, loginData.session_token);

        if (result.success) {
            localStorage.removeItem('loginData');
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('selectedAreaWithOption');

            setOpen(true);

        } else {
            console.log(result.message);
        }

    }
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false);
    };

    const [orderHistoryAlert, setOrderHistoryAlert] = useState(false);

    const handleNavigation = () => {
        if (isLoggedIn) {
            window.location.href = "/account/my-orders"; // Navigate to order history
        } else {
            setOrderHistoryAlert(true); // Show the snackbar
        }
    };

    return (
        <div className={styles.body}>
            <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Logged Out!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        You have logged out successfully
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => window.location.href = '/login'}>Back to Login</Button>
                    <Button onClick={() => window.location.href = '/'}>Home</Button>
                </DialogActions>
            </Dialog>

            <div className={styles.main}>
                <div className={styles.header}></div>

                <div className={styles.pagetitle}>
                    <span className={styles.title}>Account</span>
                </div>

                <div className={styles.navmenulist}>

                    <Link href={linkHref}>
                        <div className={styles.navmenuitem}>
                            <img className={styles.navmenuimage} src="/profile.svg" />
                            <span className={styles.navmenuname}>{isLoggedIn ? 'Profile' : 'Login'}</span>
                        </div>
                    </Link>

                    <Link href={'/account/settings'}>
                        <div className={styles.navmenuitem}>
                            <img className={styles.navmenuimage} src="/app-settings.svg" />
                            <span className={styles.navmenuname}>Settings</span>
                        </div>
                    </Link>

                    <div className={styles.navmenuitem} onClick={handleNavigation}>
                        <img className={styles.navmenuimage} src="/acarts.svg" />
                        <span className={styles.navmenuname}>Order History</span>
                    </div>


                    {orderHistoryAlert &&
                        <Alert onClose={() => setOrderHistoryAlert(false)} severity="warning" variant="filled">
                            Please log in to check your order history.
                        </Alert>
                    }
                    <a href={whatsAppLink}
                        title="Click to chat on WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer">
                        <div className={styles.navmenuitem}>
                            <img className={styles.navmenuimage} src="/contactus.svg" />
                            <span className={styles.navmenuname}>Contact Us</span>
                        </div>
                    </a>

                    {isLoggedIn &&
                        <button className={styles.navmenuitem} onClick={handleLogout}>
                            <img className={styles.navmenuimage} src="/logout.svg" />
                            <span className={styles.navmenuname}>Logout</span>
                        </button>
                    }
                </div>

                <div className={styles.bottompadder}></div>

                <div className={styles.bottom_tabcontainer}>
                    <Link className={styles.tabico} href="/home">
                        <img className={styles.tabico} src="/home.svg" />
                    </Link>

                    <Link className={styles.tabico} href="/category">
                        <img className={styles.tabico} src="/category.svg" />
                    </Link>

                    <Link href="/home" legacyBehavior><img className={`${styles.tabico} ${styles.centertab}`} src="/search.svg" /></Link>



                    <Link className={styles.tabico} href="/cart">
                        <img className={styles.tabico} src="/cart.svg" />
                    </Link>

                    <Link className={styles.tabico} href="/account">
                        <img className={styles.tabico} src="/user.svg" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Account;
