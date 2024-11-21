// app/account/my-orders/page.js
'use client'

import { getOrderDetailsByCustomerId } from "@/shared/util/apiService";
import { useEffect, useState } from "react";
import styles from './my-orders.module.css';
import Link from "next/link";
import { Loader } from "@/components/Loader/Loader";
import { Alert } from "@mui/material";

const MyOrders = () => {

    const [loginData, setLoginData] = useState({});
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setLoginData(loginData);
        }
    }, []);

    const [orderDetails, setOrderDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loginData?.customer?.id) { // Check if loginData and customerId are available
            const fetchOrderDetails = async () => {
                try {
                    setLoading(true); // Set loading true while the data is being fetched
                    const data = await getOrderDetailsByCustomerId(loginData.customer.id);
                    setOrderDetails(data.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false); // Set loading false after the API call is done
                }
            };
            fetchOrderDetails();
        }
    }, [loginData]);

    if (loading) {
        return <Loader></Loader>; // Optionally, show a loading message while fetching
    }

    return (
        <div>
            <div className={styles.header}>
                <div className={styles.menu}>
                    <span className={styles.lang}>عربي</span>
                </div>
                <div className={styles.logo}></div>

            </div>

            <Link href={'/account'}>
                <div className={styles.pagetitle}>
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <span className={styles.title}>My Orders</span>
                </div>
            </Link>

            {orderDetails.length === 0 && <Alert severity="warning">No orders found</Alert>}
            {orderDetails.map(order => (
                <div key={order.id} className={styles.orderCard}>
                    <p><strong>Order Id:</strong> {order.id}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                    <p><strong>Area:</strong> {order.area}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total Cost:</strong> {order.cost.toFixed(3)} KWD</p>
                    {order.payment_status == 'captured' ?
                        <p>Payment done on {order.payment_captured_at}</p>
                        : <a href={order.charge_url} style={{ color: 'red' }}
                            target="_blank" rel="noopener noreferrer">Complete Payment
                        </a>
                    }

                    <div className={styles.menuItems}>
                        <p>Menu Items:</p>
                        {order.menu_items.length > 0 ? (
                            <ul>
                                {order.menu_items.map(item => (
                                    <li key={item.id}>
                                        <img
                                            src={item.attachment}
                                            alt={item.name}
                                            width="50"
                                            height="50"
                                        />
                                        <div>
                                            <p><strong>{item.name}</strong></p>
                                            <p><strong>Price: </strong>{item.price.toFixed(3)} KWD | <strong>Quantity: </strong>{item.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No menu items in this order.</p>
                        )}
                    </div>
                </div>
            ))}
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
    );
}

export default MyOrders;