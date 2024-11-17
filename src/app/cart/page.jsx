// app/cart/page.js
'use client'

import Link from 'next/link';
import styles from './cart.module.css';
import { useState, useEffect } from 'react';
import { makeOrder, validateCouponCode } from '@/shared/util/apiService';
import { Alert } from '@mui/material';

const Cart = () => {

    const [cart, setCart] = useState([]);

    // Fetch cart items from localStorage when the component mounts
    useEffect(() => {
        const storedCart = localStorage.getItem("cart")
        setCart(storedCart ? JSON.parse(storedCart) : []);
    }, []);

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

    const [loginData, setLoginData] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setLoginData(loginData);
            setIsLoggedIn(true)
        }
    }, []);

    const [couponCode, setCouponCode] = useState('');
    const [discountObject, setDiscountObject] = useState({ type: null, value: 0 });
    const [couponValidated, setCouponValidated] = useState(null);

    const checkCouponCode = async () => {
        const validationResult = await validateCouponCode(couponCode, loginData?.customer?.id, loginData?.customer?.session_token);

        if (validationResult.success) {
            setDiscountObject(validationResult.data);
            setCouponValidated(true);
        } else {
            setDiscountObject({ type: null, value: 0 })
            setCouponValidated(false);
        }
    }

    const calculateSubtotal = () => {
        const itemSubtotal = cart.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;

            // Calculate the total for customizations
            const customizationTotal = item.customizations.reduce((custTotal, customization) => {
                const optionsTotal = customization.options.reduce((optTotal, option) => {
                    return optTotal + option.price * option.quantity;
                }, 0);

                return custTotal + optionsTotal;
            }, 0);

            return total + itemTotal + customizationTotal;
        }, 0);

        return itemSubtotal;
    };

    const subtotal = calculateSubtotal();

    let total = discountObject.type === 'percentage'
        ? subtotal * (1 - discountObject.value / 100)
        : subtotal - discountObject.value;

    const discount = discountObject.type === 'percentage' ?
        ((discountObject.value * subtotal) / 100) : discountObject.value

    const handleAlertClose = () => {
        setCouponValidated(null);
    }

    const handleCheckoutLoggedIn = async () => {
        // Construct menuItems for the API
        const menuItems = cart.map(item => {
            // Map the main item and include customizations
            const mainItem = {
                menu_item_id: item.id,
                qty: item.quantity,
                customizations: item.customizations.map(customization => ({
                    customization_id: customization.id,
                    name: customization.name,
                    options: customization.options
                        .filter(option => option.quantity > 0) // Only include options with quantity > 0
                        .map(option => ({
                            option_id: option.id,
                            name: option.name,
                            price: option.price,
                            qty: option.quantity
                        }))
                }))
            };

            // Remove customizations if they are empty
            if (mainItem.customizations.every(cust => cust.options.length === 0)) {
                delete mainItem.customizations;
            }

            return mainItem;
        });

        const menuItemsData = JSON.stringify(menuItems);
        const orderData = new FormData();

        orderData.append('name', loginData.customer.name);
        orderData.append('email', loginData.customer.email);
        orderData.append('phone', loginData.customer.phone);
        orderData.append('menu_items', menuItemsData);
        orderData.append('area_id', loginData.customer.id);
        orderData.append('cost', total);

        const orderResponse = await makeOrder(orderData);
        if (!orderResponse.success) {
            alert(orderResponse.message);
            return;
        }

        const paymentLink = orderResponse?.data?.data?.order?.charge_url;
        window.location.href = paymentLink;

        alert("Order placed successfully! You are being redirected to payment gateway");
    }

    const handleCheckoutNotLoggedIn = () => {
        const billingData = { subtotal, discount, total }; // Prepare the billing data
        localStorage.setItem("billingData", JSON.stringify(billingData)); // Store billing data in localStorage
    }

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

                {/* Coupon code div */}
                {couponValidated !== null && (
                    <Alert
                        severity={couponValidated ? "success" : "error"}
                        onClose={handleAlertClose}
                    >
                        {couponValidated ? "Coupon code added successfully" : "Invalid Coupon code"}
                    </Alert>
                )}
                {cart.length > 0 &&
                    <div className={styles.couponbox}>
                        <input
                            className={styles.coupontext}
                            type="text"
                            placeholder="Code Here"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)} />

                        <button
                            className={styles.couponbutton}
                            disabled={!couponCode.trim()}
                            onClick={checkCouponCode}>Enter Code
                        </button>
                    </div>
                }

                {/* Billing */}
                <div className={styles.billbox}>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Subtotal</span>
                        <span className={styles.metric}>{subtotal.toFixed(3)} KWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Discount</span>
                        <span className={styles.metric}>{discount} KWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Total</span>
                        <span className={styles.metric}>{total.toFixed(3)} KWD</span>
                    </div>
                    <div className={styles.line}></div>
                </div>

                {isLoggedIn ? (
                    // If user is logged in, show the API checkout button
                    <button onClick={handleCheckoutLoggedIn} className={styles.button}>
                        Checkout
                    </button>
                ) : (
                    // If user is not logged in, render Link with href='/checkout'
                    <Link className={styles.button} href='/checkout'>
                        <div onClick={handleCheckoutNotLoggedIn} className={styles.button}>
                            <span className={styles.buttontitle}>Checkout</span>
                        </div>
                    </Link>
                )}

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
