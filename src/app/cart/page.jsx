// app/cart/page.js
'use client'

import Link from 'next/link';
import styles from './cart.module.css';
import { useState, useEffect } from 'react';
import { getAreas, getInitialData, getUserAreas, makeOrder, validateCouponCode } from '@/shared/util/apiService';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import DeliveryFormPopup from "@/components/Delivery Form Popup/DeliveryFormPopup";

const Cart = () => {

    const [cart, setCart] = useState([]);
    const [deliveryPopup, setDeliveryPopup] = useState(false);
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

    const [userAreas, setUserAreas] = useState([]);
    const [areas, setAreas] = useState([]);

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
        const savedArea = JSON.parse(localStorage.getItem('selectedAreaWithOption'));
        if (savedArea) {
            setSelectedArea(savedArea.area);
        }
    }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setLoginData(loginData);
            setIsLoggedIn(true);
            fetchUserAreas(loginData?.customer?.id, loginData?.customer?.session_token);
            fetchAreas();
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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCheckoutLoggedIn = async () => {

        if (cart.length === 0) {
            alert("Your cart is empty. Add items before placing an order.");
            return;
        }

        if (selectedArea === null) {
            alert("Please select an address or create one");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

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
        orderData.append('area_id', selectedArea.area_id || 0);
        orderData.append('address_id', selectedArea.title == '' || !selectedArea.title ? selectedArea.id : 0);
        orderData.append('pickup_address', selectedArea.title || '');
        orderData.append('cost', total);
        orderData.append('payment_mode', paymentOption);
        orderData.append('coupon_code', couponValidated ? couponCode : '');

        const orderResponse = await makeOrder(orderData, loginData.customer.id);
        if (!orderResponse.success) {
            alert(orderResponse.message);
            setIsSubmitting(false);
            return;
        }

        const paymentLink = orderResponse?.data?.data?.order?.charge_url;
        if (paymentLink.trim() === '' || !paymentLink) {
            alert("Order placed successfully for cash on delivery");
            window.location.href = '/account/my-orders';
            return;
        }

        setCart([]); // Clear the cart state
        localStorage.removeItem("cart"); // Remove cart from localStorage

        alert("Order placed successfully! You are being redirected to payment gateway");
        window.location.href = paymentLink;
    }

    const handleCheckoutNotLoggedIn = () => {
        const billingData = { subtotal, discount, total }; // Prepare the billing data
        localStorage.setItem("billingData", JSON.stringify(billingData)); // Store billing data in localStorage
    }

    const [selectedItem, setSelectedItem] = useState(null);
    const [customizationPopup, setCustomizationPopup] = useState(false);

    const handleOpenPopup = (item) => {
        setCustomizationPopup(true);
        setSelectedItem(item);
    };

    const handleClosePopup = () => {
        setCustomizationPopup(false);
        setSelectedItem(null);
    };

    const handlePopupClose = () => {
        setDeliveryPopup(false);
    }

    const [selectedArea, setSelectedArea] = useState(null);
    const handleAreaSelect = (area) => {
        console.log(area)
        setSelectedArea(area);
        setDeliveryPopup(false); // Close popup after selection
    };

    const [paymentOption, setPaymentOption] = useState('online');
    const handlePaymentOptionSelection = (event) => {
        setPaymentOption(event.target.value);
    };

    const [pickupAreas, setPickupAreas] = useState([]);

    // const [initialData, setInitialData] = useState([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const data = await getInitialData();
                // setInitialData(data);
                const addresses = Array.isArray(data.organization.configurations.general.address)
                    ? data.organization.configurations.general.address
                    : [data.organization.configurations.general.address];

                const normalizedAddresses = addresses.map((address, index) => ({
                    id: index + 1, // Generate a unique id for each address
                    title: address  // Use the address string as the title
                }));

                setPickupAreas(normalizedAddresses);
            } catch (error) {
                console.error(error);
            }
        };
        fetchInitialData();
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
                            <div key={index} className={styles.cartitem} onClick={() => handleOpenPopup(item)}>
                                <img className={styles.cartimage} src={item.image} alt={item.name} />
                                <div className={styles.cartcontent}>
                                    <div className={styles.carttext}>
                                        <span className={styles.cartname}>{item.name}</span>
                                    </div>
                                    <div className={styles.amount}>
                                        <button
                                            className={styles.qtyicon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveQuantity(item.id);
                                            }}
                                        >
                                            <img src="/minus.svg" />
                                        </button>
                                        <span className={styles.qty}>{item.quantity}</span>
                                        <button
                                            className={styles.qtyicon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddQuantity(item.id);
                                            }}
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

                {/* Popup Dialog for customizations */}
                <Dialog open={customizationPopup} onClose={handleClosePopup}>
                    <DialogTitle style={{ fontWeight: 'bolder' }}>Customizations selected for {selectedItem?.name}</DialogTitle>
                    <DialogContent>
                        {selectedItem?.customizations?.length > 0 ? (
                            selectedItem.customizations.map((customization) => (
                                (customization.options.length > 0 &&
                                    <div key={customization.customization_id} style={{ marginTop: 10 }}>
                                        <h4 style={{ fontSize: 18, fontWeight: 'bold' }}>{customization.name}: </h4>
                                        <ul>
                                            {customization.options.map((option) => (
                                                <li key={option.id}>
                                                    {option.name} - {option?.price} KWD (Qty: {option.quantity})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )))
                        ) : (
                            <p>No customizations selected.</p>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePopup}>Close</Button>
                    </DialogActions>
                </Dialog>

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
                        <span className={styles.metric}>{discount.toFixed(3)} KWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Total</span>
                        <span className={styles.metric}>{total.toFixed(3)} KWD</span>
                    </div>
                    <div className={styles.line}></div>
                </div>

                {deliveryPopup &&
                    <DeliveryFormPopup
                        userAreas={userAreas}
                        showPickup={true}
                        pickupAreas={pickupAreas}
                        open={deliveryPopup}
                        handlePopupClose={handlePopupClose}
                        onAreaSelect={handleAreaSelect}
                        fullScreen={false}
                        areas={areas}
                        refreshAddresses={() => fetchUserAreas(loginData.customer.id, loginData.customer.session_token)}
                        edit={true}
                    ></DeliveryFormPopup>
                }

                <FormControl style={{ marginTop: '10px' }}>
                    <FormLabel sx={{
                        color: 'red', '&.Mui-focused': { color: 'red' }
                    }} id="payment-options-row-radio-buttons-group-label">Payment Option</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="payment-options-row-radio-buttons-group-label"
                        name="payment-options"
                        value={paymentOption}
                        onChange={handlePaymentOptionSelection}
                    >
                        <FormControlLabel
                            value="online"
                            control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                            label="Online" />

                        <FormControlLabel
                            value="cod"
                            control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                            label="Cash on delivery" />

                    </RadioGroup>
                </FormControl>

                {isLoggedIn ? (
                    <>
                        <Button
                            sx={{ backgroundColor: '#F12828', color: 'black', borderRadius: '20px', marginTop: '10px' }}
                            variant='contained'
                            onClick={() => setDeliveryPopup(true)}>
                            Select address
                        </Button>
                        {selectedArea && <p style={{ marginTop: '10px' }}><strong>Selected address: </strong><u>{selectedArea.name || selectedArea.title}</u></p>}

                        <button onClick={handleCheckoutLoggedIn} className={styles.button} disabled={isSubmitting}>
                            Checkout
                        </button>
                    </>
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
}

export default Cart;
