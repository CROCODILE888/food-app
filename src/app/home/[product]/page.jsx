// app/home/[product]/page.js
'use client'
import { getMenuItems } from '@/shared/util/apiService';
import { useState, useEffect } from 'react';
import styles from './product.module.css';
import Link from "next/link";
import { usePathname } from 'next/navigation';

const ProductPage = () => {

    const pathname = usePathname(); // Get the current pathname
    const product = pathname.split('/').pop(); // Extract the category from the URL

    const [menuItems, setMenuItems] = useState([]);
    const [filteredProduct, setFilteredProduct] = useState([]);
    const [itemQuantity, setItemQuantity] = useState(0);
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const [customizations, setCusomizations] = useState([]);

    const [addOnQuantities, setAddOnQuantities] = useState({});
    // Fetch menu items when the component is mounted
    useEffect(() => {
        const fetchMenuItems = async () => {
            const items = await getMenuItems();
            setMenuItems(items);
        };
        fetchMenuItems();
    }, []);

    useEffect(() => {
        if (product && menuItems.length > 0) {
            const selectedProduct = menuItems
                .flatMap(category => category.type_data) // Flattening the array of type_data
                .find(item => item.slug === product); // Find product by slug in type_data

            setFilteredProduct(selectedProduct);
            setCusomizations(selectedProduct?.customizations);

            // Initialize addOnQuantities for each add-on with quantity 0
            if (Object.keys(addOnQuantities).length === 0) {
                const initialAddOnQuantities = selectedProduct?.customizations?.reduce((acc, customization) => {
                    customization?.options.forEach(option => {
                        acc[option.option_id] = 0;
                    });
                    return acc;
                }, {});
                setAddOnQuantities(initialAddOnQuantities || {});
            }
        }
    }, [product, menuItems]);

    const handleGoBack = () => {
        const previousPage = document.referrer; // Get the previous page URL
        if (previousPage) {
            window.history.back(); // Go back in history if there's a referrer
        } else {
            window.location.href = '/home'; // Redirect to home page if no referrer
        }
    };

    const handleItemAddQuantity = () => {
        setItemQuantity(prevQuantity => prevQuantity + 1);
        setIsAddedToCart(false);
    }

    const handleItemRemoveQuantity = () => {
        setItemQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
        setIsAddedToCart(false);
    }

    // const handleAddOnAddQuantity = (addOnId) => {
    //     setAddOnQuantities(prevQuantities => ({
    //         ...prevQuantities,
    //         [addOnId]: prevQuantities[addOnId] + 1
    //     }));
    // }

    const handleAddOnAddQuantity = (customizationId, addOnId) => {
        setAddOnQuantities((prevQuantities) => {
            const currentCustomization = customizations.find(
                (customization) => customization.customization_id === customizationId
            );

            if (currentCustomization.selection_type === 'single') {
                // Reset other quantities for this customization
                return {
                    ...prevQuantities,
                    ...Object.fromEntries(
                        currentCustomization.options.map((option) => [option.option_id, 0])
                    ),
                    [addOnId]: (prevQuantities[addOnId] || 0) + 1,
                };
            }

            if (currentCustomization.selection_type === 'multiple') {
                const maxLimit = currentCustomization.maximum_selection_limit;

                // Count how many options currently have quantity > 0, excluding the current option
                const selectedCount = currentCustomization.options.reduce((count, option) => {
                    if (option.option_id !== addOnId && (prevQuantities[option.option_id] || 0) > 0) {
                        return count + 1;
                    }
                    return count;
                }, 0);

                if (maxLimit > 0 && selectedCount >= maxLimit) {
                    // Limit reached for the number of options selected
                    return prevQuantities;
                }
            }

            // No constraints or limit not reached
            return {
                ...prevQuantities,
                [addOnId]: (prevQuantities[addOnId] || 0) + 1,
            };
        });
    };

    const handleAddOnRemoveQuantity = (addOnId) => {
        setAddOnQuantities(prevQuantities => ({
            ...prevQuantities,
            [addOnId]: Math.max(prevQuantities[addOnId] - 1, 0)
        }));
    }

    const handleCartUpdate = () => {
        if (itemQuantity > 0) {
            // Get existing cart from localStorage or initialize an empty array
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

            // Add the current item to the cart
            const newItem = {
                id: filteredProduct.id,
                name: filteredProduct.name,
                price: filteredProduct.price,
                quantity: itemQuantity,
                image: filteredProduct.attachment,
                customizations: customizations.map(customization => ({
                    customization_id: customization.customization_id,
                    name: customization.name,
                    options: customization.options
                        .filter(option => addOnQuantities[option.option_id] > 0)
                        .map(option => ({
                            id: option.option_id,
                            name: option.name,
                            quantity: addOnQuantities[option.option_id] || 0,
                            price: option.price
                        }))
                })),
            };

            // Add the new item, or update quantity if the item already exists
            const updatedCart = existingCart.filter(item => item.id !== newItem.id); // Remove previous instance
            updatedCart.push(newItem);  // Add new or updated item

            // Save the updated cart back to localStorage
            localStorage.setItem("cart", JSON.stringify(updatedCart));

            setIsAddedToCart(true);

            // Optionally, reset quantity or display confirmation
            // setQuantity(0);
        }
    };

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
                    <button onClick={handleGoBack}>
                        <img className={styles.sysico} src="/chevron-left.svg" /></button>
                    <span className={styles.title}>Product Details</span>
                </div>

                <div className={styles.mainitem}>
                    <img className={styles.mainimage} src={filteredProduct.attachment} />

                    <div className={styles.maincontent}>
                        <div className={styles.maintext}>
                            <span className={styles.mainname}>{filteredProduct.name}</span>
                            <span className={styles.maindescription}>{filteredProduct.description}</span>
                        </div>
                        <div className={styles.amount}>
                            <button onClick={handleItemRemoveQuantity}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                            </button>
                            <span className={styles.qty}>{itemQuantity}</span>
                            <button onClick={handleItemAddQuantity}>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </button>
                        </div>
                        <span className={styles.mainprice}>{filteredProduct.price} KWD</span>
                    </div>


                </div>

                {customizations.length > 0 &&
                    <div className={styles.pagetitle}>
                        <span className={styles.title}>Available Add-ons</span>
                    </div>
                }
                <div className={styles.addons}>
                    {customizations?.map((customization) => (
                        <div key={customization.customization_id} className={styles.customizationBlock}>
                            {/* Display the name of the customization */}
                            <div className={styles.customizationName}>
                                <strong>{customization.name}</strong><i className="fa-thin fa-circle-info"></i>
                            </div>
                            <p>Maximum options that can be selected: <strong>{customization.maximum_selection_limit}</strong></p>

                            {customization.options.map((option, index) => (
                                <div key={index} className={styles.addonitem}>
                                    <div className={styles.addoncontent}>
                                        <div className={styles.addontext}>
                                            <span className={styles.addonname}>{option.name}</span>
                                        </div>
                                        <span className={styles.addonprice}>{option.price}</span>

                                        <div className={styles.amount}>
                                            <button onClick={() => handleAddOnRemoveQuantity(option.option_id)}>
                                                <img className={styles.qtyicon} src="/minus.svg" />
                                            </button>

                                            <span className={styles.qty}>{addOnQuantities[option.option_id] || 0}</span>

                                            <button onClick={() => handleAddOnAddQuantity(customization.customization_id, option.option_id)}>
                                                <img className={styles.qtyicon} src="/plus.svg" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ))}
                </div>

                {itemQuantity > 0 &&
                    <button
                        className={styles.submitButton}
                        onClick={handleCartUpdate}
                        disabled={isAddedToCart}
                    >{isAddedToCart ? "Added to Cart" : "Add to Cart"}
                    </button>}
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
    )
}

export default ProductPage;