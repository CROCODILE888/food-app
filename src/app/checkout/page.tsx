// app/checkout/page.js
'use client'

import Link from "next/link";
import styles from './checkout.module.css'
import { useState, useEffect } from "react";

const Checkout = () => {

    const [cart, setCart] = useState([]);

    // Fetch cart items from localStorage when the component mounts
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <div className="body">
            <div className={styles.main}>
                <div className={styles.header}>
                    <div className={styles.menu}>
                        <div className={styles.ico}></div>
                        <span className={styles.lang}>عربي</span>
                    </div>

                    <div className={styles.logo}></div>
                </div>

                <div className={styles.pagetitle}>
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <Link href={'/cart'}>
                        <span className={styles.title}>Checkout</span>
                    </Link>
                </div>

                <div className={styles.addbar}>
                    <Link href="/home">
                        <div className={styles.locationbutton}>
                            <span className={styles.addname}>House</span>
                            <div className={styles.addressico}>
                                <div className={`${styles.addressicoinner} ${styles.houseico}`}></div>
                            </div>
                        </div>
                    </Link>

                    <div className={styles.locationbutton}>
                        <span className={styles.addname}>Apartment</span>
                        <div className={styles.addressico}>
                            <div className={`${styles.addressicoinner} ${styles.aptico}`}></div>
                        </div>
                    </div>

                    <div className={styles.locationbutton}>
                        <span className={styles.addname}>Office</span>
                        <div className={styles.addressico}>
                            <div className={`${styles.addressicoinner} ${styles.officeico}`}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.formMain}>
                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>+965</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Name</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>+965</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Email</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Area</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Block</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Street</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>House/Apartment No</span>
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>Password</span>
                        </div>
                    </div>
                </div>

                <label className={styles.bottomtext}>
                    <input type="checkbox" name="fruit" value="apple" />
                    Use the details to create an account
                </label>

                <div className={styles.v1_1021}>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Subtotal</span>
                        <span className={styles.metric}>{subtotal.toFixed(3)} kWD</span>
                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Other Charges</span>
                        <span className={styles.metric}>1.000 KWD</span>
                    </div>

                    <div className={styles.line}></div>

                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Total</span>
                        <span className={styles.metric}>{(subtotal + 1).toFixed(3)} kWD</span>
                    </div>

                    <div className={styles.line}></div>
                </div>

                <Link href={'/payment'}>
                    <button className={styles.button}>
                        <span className={styles.buttontitle}>Checkout</span>
                    </button>
                </Link>
                <div className={styles.bottompadder}></div>
            </div>
        </div>
    );
}

export default Checkout;