// app/home/[product]/page.js
'use client'
import { getMenuItems } from '@/shared/util/apiService';
import { useState, useEffect } from 'react';
import styles from './product.module.css';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { MenuItems } from '@/shared/interfaces/menuItemsInterface';

const ProductPage = () => {

    const pathname = usePathname(); // Get the current pathname
    const product = pathname.split('/').pop(); // Extract the category from the URL

    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [filteredProduct, setFilteredProduct] = useState<any[]>([]);
    const [quantity, setQuantity] = useState(0);
    const [isAddedToCart, setIsAddedToCart] = useState(false);

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

    const handleAddQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
        setIsAddedToCart(false);
    }

    const handleRemoveQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 0 ? prevQuantity - 1 : 0));
        setIsAddedToCart(false);
    }

    const handleCartUpdate = () => {
        if (quantity > 0) {
            // Get existing cart from localStorage or initialize an empty array
            const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

            // Add the current item to the cart
            const newItem = {
                id: filteredProduct.id,
                name: filteredProduct.name,
                price: filteredProduct.price,
                quantity: quantity,
                image: filteredProduct.attachment,
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
                            <button onClick={handleRemoveQuantity}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                            </button>
                            <span className={styles.qty}>{quantity}</span>
                            <button onClick={handleAddQuantity}>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </button>
                        </div>
                        <span className={styles.mainprice}>{filteredProduct.price} KWD</span>
                    </div>

                    {quantity > 0 &&
                        <button
                            className={styles.submitButton}
                            onClick={handleCartUpdate}
                            disabled={isAddedToCart}
                        >{isAddedToCart ? "Added to Cart" : "Add to Cart"}
                        </button>}
                </div>

                {/* <div className={styles.pagetitle}>
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <span className={styles.title}>Available Add-ons</span>
                </div>

                <div className={styles.addons}>
                    <div className={styles.addonitem}>
                        <div className={styles.addoncontent}>
                            <div className={styles.addontext}>
                                <span className={styles.addonname}>Extra Sauce</span>
                            </div>
                            <span className={styles.addonprice}>1.000 KWD</span>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.addonitem}>
                        <div className={styles.addoncontent}>
                            <div className={styles.addontext}>
                                <span className={styles.addonname}>Extra cheese</span>
                            </div>
                            <span className={styles.addonprice}>10.000 KWD</span>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.addonitem}>
                        <div className={styles.addoncontent}>
                            <div className={styles.addontext}>
                                <span className={styles.addonname}>With tissue</span>
                            </div>
                            <span className={styles.addonprice}>1.500 KWD</span>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.addonitem}>
                        <div className={styles.addoncontent}>
                            <div className={styles.addontext}>
                                <span className={styles.addonname}>Extra Box</span>
                            </div>
                            <span className={styles.addonprice}>0.000 KWD</span>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                        </div>
                    </div>

                    <div className={styles.addonitem}>
                        <div className={styles.addoncontent}>
                            <div className={styles.addontext}>
                                <span className={styles.addonname}>Chilli</span>
                            </div>
                            <span className={styles.addonprice}>0.000 KWD</span>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                        </div>
                    </div>
                </div> */}

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
    )
}

export default ProductPage;
