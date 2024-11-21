// app/category/products/[category]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from '../../category.module.css';
import { getMenuItems } from '@/shared/util/apiService';
import { Loader } from '@/components/Loader/Loader';

const CategoryProducts = () => {
    const pathname = usePathname(); // Get the current pathname
    const category = pathname.split('/').pop(); // Extract the category from the URL

    const [menuItems, setMenuItems] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Fetch menu items when the component is mounted
    useEffect(() => {
        const fetchMenuItems = async () => {
            const items = await getMenuItems();
            setMenuItems(items);
        };
        fetchMenuItems();
    }, []);

    // Filter products based on selected category when available
    useEffect(() => {
        if (category && menuItems.length > 0) {
            const selectedCategoryData = menuItems.find(
                (item) => item.type_name.toLowerCase().replace(/ /g, '-') === category
            );
            if (selectedCategoryData) {
                setFilteredProducts(selectedCategoryData.type_data); // Set products for selected category
            }
        }
    }, [category, menuItems]);

    // Ensure category is loaded before rendering
    if (!category) {
        return <Loader></Loader>;
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

                <div className={styles.pagetitle}>
                    <Link href={'/category'}>
                        <img className={styles.sysico} src="/chevron-left.svg" />
                    </Link>
                    <span className={styles.title}>{category?.replace(/-/g, ' ')}</span>
                </div>

                {/* Display Products for Selected Category */}
                <div className={styles.categorylist}>

                    {filteredProducts.map((product, index) => (
                        <div key={index} className={styles.categoryitem}>
                            <Link className={styles.categoryimage} href={`/home/${product.slug}`}>
                                <img
                                    className={styles.categoryimage}
                                    src={product.attachment || '/placeholder.jpg'}
                                    alt={product.name}
                                />
                            </Link>
                            <div className={styles.boxdecor}></div>

                            <span className={styles.categoryname}>{product.name}</span>
                            <span className={styles.productprice}>{product.price.toFixed(3)} kWD</span>
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
};

export default CategoryProducts;
