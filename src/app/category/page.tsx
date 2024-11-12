// app/category/page.js
'use client'

import Link from 'next/link';
import styles from './category.module.css';
import { MenuItems } from '@/shared/interfaces/menuItemsInterface';
import { getMenuItems } from '@/shared/util/apiService';
import { useState, useEffect } from 'react';

const Category = () => {
    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        const fetchMenuItems = async () => {
            const items = await getMenuItems();
            setMenuItems(items);
            const typeNames = items.map((category) => category.type_name);
            setCategories(typeNames);
        };
        fetchMenuItems();
        console.log(categories, menuItems)
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

                <div className={styles.pagetitle}>
                    <Link href={'/home'}>
                        <img className={styles.sysico} src="/chevron-left.svg" />
                    </Link>
                    <span className={styles.title}>Category</span>

                </div>

                <div className={styles.categorylist}>

                    {menuItems.map((category, index) => (
                        <div key={index} className={styles.categoryitem}>
                            <Link className={styles.categoryimage} href={`/category/products/${category.type_name.toLowerCase().replace(/ /g, '-')}`}>
                                <img
                                    className={styles.categoryimage}
                                    src={category.type_data[0]?.attachment || '/4.jpg'} // Use first item's image or a placeholder
                                    alt={category.type_name}
                                />
                            </Link>
                            <div className={styles.boxdecor}></div>
                            <span className={styles.categoryname}>{category.type_name}</span>
                        </div>
                    ))}
                </div>

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

export default Category;
