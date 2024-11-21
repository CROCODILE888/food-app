// app/account/profile/page.js
'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import DeliveryFormPopup from '@/components/Delivery Form Popup/DeliveryFormPopup';
import { getAreas, getUserAreas } from '@/shared/util/apiService';

const Profile = () => {
    const [userName, setUserName] = useState('');
    const [deliveryPopup, setDeliveryPopup] = useState(false);
    const [userAreas, setUserAreas] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loginData, setLoginData] = useState({});

    const fetchUserAreas = async (customerId, sessionToken) => {
        try {
            const data = await getUserAreas(customerId, sessionToken);
            setUserAreas(data?.data?.addresses);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAreas = async () => {
        try {
            const data = await getAreas();
            setAreas(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            if (loginData) {
                setLoginData(loginData);
                fetchUserAreas(loginData?.customer?.id, loginData?.customer?.session_token);
                fetchAreas();
                setUserName(loginData.customer.name || '');
            }
        }
    }, []);

    const handlePopupClose = () => {
        setDeliveryPopup(false);
    }

    const handleAreaSelect = () => {
        return;// Close popup after selection
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <div className={styles.menu}>
                    <Link href={'/account'}>
                        <div className={styles.ico}></div>
                    </Link>
                    <span className={styles.lang}>عربي</span>
                </div>

                <div className={styles.logo}></div>
            </div>

            <Link href={'/account'}>
                <div className={styles.pagetitle}>
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <span className={styles.title}>{userName}&apos;s Profile</span>
                </div>
            </Link>

            <div className={styles.navmenulist}>

                <div className={styles.navmenuitem} onClick={() => setDeliveryPopup(true)}>
                    <img className={styles.navmenuimage} src="/apt.png" />
                    <span className={styles.navmenuname}>My addresses</span>
                </div>

            </div>

            {deliveryPopup &&
                <DeliveryFormPopup
                    userAreas={userAreas}
                    open={deliveryPopup}
                    handlePopupClose={handlePopupClose}
                    onAreaSelect={handleAreaSelect}
                    fullScreen={false}
                    areas={areas}
                    refreshAddresses={() => fetchUserAreas(loginData.customer.id, loginData.customer.session_token)}
                    edit={false}
                ></DeliveryFormPopup>
            }
            <div className={styles.bottompadder}></div>

            {/* <div className={styles.bottom_tabcontainer}>
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
            </div> */}
        </div>
    )
}

export default Profile