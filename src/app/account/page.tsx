// app/account/page.js
'use client'

import styles from './account.module.css';
import Link from 'next/link';

const Account = () => {
    return (
        <div className={styles.body}>
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

                <div className={styles.pagetitle}>
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <span className={styles.title}>Account</span>
                </div>

                <div className={styles.navmenulist}>
                    <div className={styles.navmenuitem}>
                        <img className={styles.navmenuimage} src="/profile.svg" />
                        <span className={styles.navmenuname}>Profile</span>
                    </div>

                    <div className={styles.navmenuitem}>
                        <img className={styles.navmenuimage} src="/app-settings.svg" />
                        <span className={styles.navmenuname}>Settings</span>
                    </div>

                    <div className={styles.navmenuitem}>
                        <img className={styles.navmenuimage} src="/acarts.svg" />
                        <span className={styles.navmenuname}>Order History</span>
                    </div>

                    <div className={styles.navmenuitem}>
                        <img className={styles.navmenuimage} src="/contactus.svg" />
                        <span className={styles.navmenuname}>Contact Us</span>
                    </div>

                    <div className={styles.navmenuitem}>
                        <img className={styles.navmenuimage} src="/logout.svg" />
                        <span className={styles.navmenuname}>Logout</span>
                    </div>
                </div>

                <div className={styles.bottompadder}></div>

                <div className={styles.bottom_tabcontainer}>
                    <Link className={styles.tabico} href="/home">
                        <img className={styles.tabico} src="/home.svg" />
                    </Link>

                    <Link className={styles.tabico} href="/category">
                        <img className={styles.tabico} src="/category.svg" />
                    </Link>

                    <img className={`${styles.tabico} ${styles.centertab}`} src="/search.svg" />

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
