// app/checkout/page.js
'use client'

import Link from "next/link";
import styles from './checkout.module.css'
import { useState, useEffect } from "react";
import { addAddress, getAreas, makeOrder, postValidate } from "@/shared/util/apiService";
import { API_ENDPOINTS } from "@/shared/apiConstants";
import { FormControl, MenuItem, Select } from "@mui/material";

const Checkout = () => {

    const [billingData, setBillingData] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [areas, setAreas] = useState([]);

    useEffect(() => {
        // Retrieve the billing data from localStorage
        const storedBillingData = JSON.parse(localStorage.getItem("billingData") || '{}');
        setBillingData(storedBillingData); // Update the state with the data

        const fetchAreas = async () => {
            try {
                const data = await getAreas();
                setAreas(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAreas();
    }, []);

    const { subtotal, discount, total } = billingData;

    const [cart, setCart] = useState([]);
    const [formData, setFormData] = useState({
        countryCode: '+965',
        name: '',
        phone: '',
        email: '',
        area: '',
        block: '',
        street: '',
        apartmentNo: '',
        password: '',
        createAccount: false,
        houseName: '',
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "area") {
            const selectedArea = areas.find(area => area.title === value);
            setFormData({
                ...formData,
                area: selectedArea, // Store the entire area object
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const menuItemsGenerator = () => {
        return cart.map(item => {
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
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Your cart is empty. Add items before placing an order.");
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);
        const menuItems = menuItemsGenerator();

        const menuItemsData = JSON.stringify(menuItems);

        const signUpData = new FormData();
        signUpData.append('name', formData.name);
        signUpData.append('email', formData.email);
        signUpData.append('phone', formData.phone);
        signUpData.append('password', formData.password);
        signUpData.append('is_active', formData.createAccount ? 1 : 0);

        const signupResponse = await postValidate(API_ENDPOINTS.SIGNUP_URL, signUpData);

        if (!signupResponse.success) {
            alert(signupResponse.message);
            setIsSubmitting(false);
            return;
        }

        const customerId = signupResponse.data.data.customer.id;

        const addressData = new FormData();

        addressData.append('customer_id', customerId);
        addressData.append('governorate_id', formData.area.governorate_id);
        addressData.append('area_id', formData.area.id);
        addressData.append('slot_id', 0);
        addressData.append('name', formData.houseName);
        addressData.append('phone', formData.phone)
        addressData.append('block', formData.block)
        addressData.append('street', formData.street)
        addressData.append('flat', formData.apartmentNo)

        const addAddressResponse = await addAddress(addressData, signupResponse.data.data.customer.session_token);
        if (!addAddressResponse.success) {
            alert(addAddressResponse.message);
            setIsSubmitting(false);
            return;
        }
        // Data for making the order
        const orderData = new FormData();
        orderData.append('name', formData.name);
        orderData.append('email', formData.email);
        orderData.append('phone', formData.phone);
        orderData.append('menu_items', menuItemsData);
        orderData.append('area_id', formData.area.id);
        orderData.append('cost', total);
        orderData.append('address_id', addAddressResponse.data.data.address_id);

        // // Make the order API call
        const orderResponse = await makeOrder(orderData);
        if (!orderResponse.success) {
            alert(orderResponse.message);
            setIsSubmitting(false);
            return;
        }

        const paymentLink = orderResponse?.data?.data?.order?.charge_url;

        setCart([]); // Clear the cart state
        localStorage.removeItem("cart"); // Remove cart from localStorage

        alert("Order placed successfully! You are being redirected to payment gateway");
        window.location.href = paymentLink;
        setIsSubmitting(false);
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
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <FormControl variant="standard">
                            <div className={styles.innerinput}>
                                <div className={styles.iconplaceholder}></div>
                                <Select
                                    name="area"
                                    value={formData.area ? formData.area.title : ''}
                                    onChange={handleChange}
                                    displayEmpty
                                    required
                                    style={{ width: '100%' }} // Adjust as needed for your layout
                                >
                                    <MenuItem value="" disabled>
                                        Select Area
                                    </MenuItem>
                                    {areas.map((area) => (
                                        <MenuItem key={area.id} value={area.title}>
                                            {area.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </FormControl>
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
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="text"
                                name="houseName"
                                value={formData.houseName}
                                onChange={handleChange}
                                placeholder="House Name"
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
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputcontainer}>
                        <div className={styles.innerinput}>
                            <div className={styles.iconplaceholder}></div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                    </div>

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
                    <button className={styles.button} type="submit" disabled={isSubmitting}>
                        <span className={styles.buttontitle}>Checkout</span>
                    </button>
                    <div className={styles.bottompadder}></div>
                </form>
            </div>
        </div>
    );
}

export default Checkout;