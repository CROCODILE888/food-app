// app/checkout/page.js
'use client'

import Link from "next/link";
import styles from './checkout.module.css'
import { useState, useEffect } from "react";
import { makeOrder, postValidate } from "@/shared/util/apiService";
import { API_ENDPOINTS } from "@/shared/apiConstants";

const Checkout = () => {

    const [billingData, setBillingData] = useState({});

    useEffect(() => {
        // Retrieve the billing data from localStorage
        const storedBillingData = JSON.parse(localStorage.getItem("billingData") || '{}');
        setBillingData(storedBillingData); // Update the state with the data
    }, []);

    const { subtotal, discount, total } = billingData;

    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        countryCode: '+965',
        name: '',
        phone: '',
        email: '',
        areaId: '',
        block: '',
        street: '',
        apartmentNo: '',
        password: '',
        createAccount: false,
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const menuItems = cart.flatMap(item => [
            { menu_item_id: item.id, qty: item.quantity },
            ...item.addOns.map(addOn => ({ menu_item_id: addOn.id, qty: addOn.quantity }))
        ])

        const menuItemsData = JSON.stringify(menuItems);

        const signUpData = new FormData();
        signUpData.append('name', formData.name);
        signUpData.append('email', formData.email);
        signUpData.append('phone', formData.phone);
        signUpData.append('password', formData.password);

        const orderData = new FormData();
        orderData.append('name', formData.name);
        orderData.append('email', formData.email);
        orderData.append('phone', formData.phone);
        orderData.append('menu_items', menuItemsData);
        orderData.append('area_id', formData.areaId);
        orderData.append('cost', total);

        if (formData.createAccount) {
            // Make the signup API call
            const signupResponse = await postValidate(API_ENDPOINTS.SIGNUP_URL, signUpData);

            if (!signupResponse.success) {
                alert(signupResponse.message)
            }
        }

        // Make the order API call
        const orderResponse = await makeOrder(orderData);
        if (!orderResponse.success) {
            alert(orderResponse.message);
            return;
        }

        const paymentLink = orderResponse?.data?.data?.order?.charge_url;
        window.location.href = paymentLink;

        alert("Order placed successfully! You are being redirected to payment gateway");
    };

    return (
        <div className="body">
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
                    <Link href={'/cart'}>
                        <span className={styles.title}>Checkout</span>
                    </Link>
                </div>

                <div className={styles.addbar}>
                    <Link href="/home">
                        <div className={styles.locationbutton}>
                            <span className={styles.addname}>Home</span>
                            <div className={styles.addressico}>
                                <div className={`${styles.addressicoinner} ${styles.houseico}`}></div>
                            </div>
                        </div>
                    </Link>

                    {/* <div className={styles.locationbutton}>
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
                    </div> */}
                </div>

                <form onSubmit={handleSubmit} className={styles.formMain}>
                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <span className={styles.inputtext}>+965</span>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="number"
                                name="areaId"
                                value={formData.areaId}
                                onChange={handleChange}
                                placeholder="Area ID"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="text"
                                name="block"
                                value={formData.block}
                                onChange={handleChange}
                                placeholder="Block"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="text"
                                name="apartmentNo"
                                value={formData.apartmentNo}
                                onChange={handleChange}
                                placeholder="House/Apartment No"
                                className={styles.inputField}
                                required
                            />
                        </div>
                    </div>

                    {formData.createAccount &&
                        <div className={styles.inputcontainer}>
                            <div className={styles.innerinput}>
                                <div className={styles.iconplaceholder}></div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                        </div>
                    }

                    <label className={styles.bottomtext}>
                        <input
                            type="checkbox"
                            name="createAccount"
                            checked={formData.createAccount}
                            onChange={handleChange}
                        />
                        Use the details to create an account
                    </label>

                    <div className={styles.v1_1021}>
                        <div className={styles.metricrow}>
                            <span className={styles.metrictitle}>Subtotal</span>
                            <span className={styles.metric}>{subtotal?.toFixed(3)} KWD</span>
                        </div>

                        <div className={styles.line}></div>

                        <div className={styles.metricrow}>
                            <span className={styles.metrictitle}>Discount</span>
                            <span className={styles.metric}>{discount?.toFixed(3)} KWD</span>
                        </div>

                        <div className={styles.line}></div>

                        <div className={styles.metricrow}>
                            <span className={styles.metrictitle}>Total</span>
                            <span className={styles.metric}>{total?.toFixed(3)} KWD</span>
                        </div>

                        <div className={styles.line}></div>
                    </div>
                    <button className={styles.button} type="submit">
                        <span className={styles.buttontitle}>Checkout</span>
                    </button>
                    <div className={styles.bottompadder}></div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;