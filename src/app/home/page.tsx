// app/home/page.js
'use client'
import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import Image from 'next/image';
import { getMenuItems } from '@/shared/util/apiService';
import { MenuItems } from '@/shared/interfaces/menuItemsInterface';
import { Loader } from '@/components/Loader/Loader';

export default function HomePage() {

    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    if (loading) return <Loader />
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={styles.homePage}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.menuButton}>☰</button>
                    <span className={styles.greeting}>Hey Halal, <strong>Good Afternoon!</strong></span>
                </div>
                <div className={styles.headerRight}>
                    <button className={styles.deliveryButton}>Delivery</button>
                    <button className={styles.pickupButton}>Pickup</button>
                </div>
            </header>
            <div className={styles.addressContainer}>
                <input type="text" placeholder="Enter Your Address" className={styles.addressInput} />
                <button className={styles.findButton}>Find Food</button>
            </div>

            {/* Display each category */}
            {menuItems?.map((category) => (
                <div key={category.type_name} className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>{category.type_name}</h2>

                    <div className={styles.items}>
                        {category.type_data.map((item) => (
                            <div key={item.id} className={styles.itemCard}>
                                <Image
                                    src={item.attachment}
                                    alt={item.name}
                                    className={styles.itemImage}
                                    width={150}
                                    height={150}
                                />
                                <div className={styles.itemDetails}>
                                    <h3 className={styles.itemName}>{item.name}</h3>
                                    <span className={styles.itemPrice}>{item.price} KWD</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
