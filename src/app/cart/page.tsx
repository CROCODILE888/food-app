// app/cart/page.js
'use client'

import Link from 'next/link';
import styles from './cart.module.css';
import { useState, useEffect } from 'react';

const Cart = () => {

    const [cart, setCart] = useState([]);

    // Fetch cart items from localStorage when the component mounts
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Function to update localStorage with the latest cart data
    const updateLocalStorage = (updatedCart) => {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleAddQuantity = (itemId) => {
        const updatedCart = cart.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
        updateLocalStorage(updatedCart); // Update localStorage
    };

    const handleRemoveQuantity = (itemId) => {
        const updatedCart = cart
            .map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0); // Remove items with quantity 0
        setCart(updatedCart);
        updateLocalStorage(updatedCart); // Update localStorage
    };

    const [linkHref, setLinkHref] = useState('/checkout'); useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            setLinkHref('/payment')
            // const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            // setUserName(loginData.customer.name || ''); // Assuming 'name' is the key in your login response
        }
    }, []);

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

                <Link href={'/home'}>
                    <div className={styles.pagetitle}>
                        <img className={styles.sysico} src="/chevron-left.svg" />
                        <span className={styles.title}>Cart</span>
                    </div>
                </Link>


                <div className={styles.cartlist}>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <div key={index} className={styles.cartitem}>
                                <img className={styles.cartimage} src={item.image} alt={item.name} />
                                <div className={styles.cartcontent}>
                                    <div className={styles.carttext}>
                                        <span className={styles.cartname}>{item.name}</span>
                                    </div>
                                    <div className={styles.amount}>
                                        <button
                                            className={styles.qtyicon}
                                            onClick={() => handleRemoveQuantity(item.id)}
                                        >
                                            <img src="/minus.svg" />
                                        </button>
                                        <span className={styles.qty}>{item.quantity}</span>
                                        <button
                                            className={styles.qtyicon}
                                            onClick={() => handleAddQuantity(item.id)}
                                        >
                                            <img src="/plus.svg" />
                                        </button>
                                    </div>
                                    <span className={styles.cartprice}>{item.price.toFixed(3)} KWD</span>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>


                <div className={styles.couponbox}>
                    <input className={styles.coupontext} type="text" placeholder="Code Here" />
                    <div className={styles.couponbutton}>Enter Code</div>
                </div>

                <div className={styles.billbox}>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Subtotal</span>
                        <span className={styles.metric}>{subtotal.toFixed(3)} kWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Discount</span>
                        <span className={styles.metric}>0.000 KWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Total</span>
                        <span className={styles.metric}>{(subtotal - 0).toFixed(3)} kWD</span>
                    </div>
                    <div className={styles.line}></div>
                </div>

                <Link className={styles.button} href={linkHref}>
                    <div className={styles.button}>
                        <span className={styles.buttontitle}>Checkout</span>
                    </div>
                </Link>

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
}

export default Cart;
