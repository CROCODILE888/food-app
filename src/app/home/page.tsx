// app/home/page.js
'use client'
import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import { getMenuItems, getAreas, getGovernorates } from '@/shared/util/apiService';
import { MenuItems } from '@/shared/interfaces/menuItemsInterface';
import { Loader } from '@/components/Loader/Loader';
import Link from 'next/link';

export default function HomePage() {

    const [menuItems, setMenuItems] = useState<MenuItems[]>([]);
    const [areas, setAreas] = useState([]);
    const [governorates, setGovernorates] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState('');

    const [selectedOption, setSelectedOption] = useState(null); // Options: null, 'delivery', 'pickup'
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);

    useEffect(() => {

        const fetchAreas = async () => {
            try {
                const data = await getAreas();
                setAreas(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAreas();

        const fetchGovernorates = async () => {
            try {
                const data = await getGovernorates();
                setGovernorates(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGovernorates();

        const fetchMenuItems = async () => {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
                const typeNames = items.map((category) => category.type_name);
                setCategories(typeNames);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    const [userName, setUserName] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setUserName(loginData.customer.name || ''); // Assuming 'name' is the key in your login response
        }
    }, []);

    // Determine placeholder and options based on selection
    const placeholderText = selectedOption ? 'Find Areas' : 'Find Food';

    // Filter options based on search query and selected option
    useEffect(() => {
        let options;
        if (selectedOption === 'delivery' || selectedOption === 'pickup') {
            options = areas.filter(area =>
                area.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            options = menuItems.flatMap(category =>
                category.type_data.filter(item =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }
        setFilteredOptions(options);
    }, [searchQuery, selectedOption, areas, menuItems]);

    // Handle selection of Delivery/Pickup and toggle back to Find Food if deselected
    const handleOptionClick = (option) => {
        setSelectedOption(prevOption => (prevOption === option ? null : option));
    };

    // Handle search query changes and show dropdown
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setShowDropdown(true);
    };

    const displayedCategories = categories.slice(0, 3);

    if (loading) return <Loader />
    if (error) return <p>Error: {error}</p>;
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
                    <img className={styles.sysico} src="/profile.svg" />
                    <span className={styles.title}>Hello{userName ? `, ${userName}` : ''}!</span>
                </div>

                <div className={styles.topblock}>
                    {/* Delivery Option */}
                    <div
                        className={`${styles.blockitem} ${selectedOption === 'delivery' ? styles.item_selected : ''}`}
                        onClick={() => handleOptionClick('delivery')}
                    >
                        <span className={styles.itemname}>Delivery</span>
                        <div className={styles.itemico}>
                            <div className={`${styles.itemicoinner} ${styles.deliveryico}`}></div>
                        </div>
                    </div>

                    {/* Pickup Option */}
                    <div
                        className={`${styles.blockitem} ${selectedOption === 'pickup' ? styles.item_selected : ''}`}
                        onClick={() => handleOptionClick('pickup')}
                    >
                        <span className={styles.itemname}>PickUp</span>
                        <div className={styles.itemico}>
                            <div className={`${styles.itemicoinner} ${styles.pickico}`}></div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={styles.blockitem_big}>
                        <input
                            type="text"
                            className={styles.searchbar}
                            placeholder={placeholderText}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onClick={() => setShowDropdown(!showDropdown)}
                        />

                        {/* Dropdown for filtered options */}
                        {showDropdown && (
                            <div className={styles.dropdown}>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => (
                                        <div key={index} className={styles.dropdownOption}>
                                            {selectedOption ? option.title : option.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noOptions}>No options found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>


                <div className={styles.innertitle}>
                    <span>All Categories</span>
                    <Link href={'/category'}>
                        <span className={styles.small}>See All
                            <img className={styles.sysico} src="/chevron-right.svg" /></span>
                    </Link>
                </div>
                {/* Render categories dynamically */}
                <div className={styles.foodtype}>
                    {displayedCategories.map((category, index) => (
                        <Link key={index} href={`/category/products/${category.toLowerCase().replace(/ /g, '-')}`}>
                            <div className={styles.foodtypeitem}>
                                <img
                                    className={styles.foodtypeicon}
                                    src={`/4.png`}
                                    alt={category}
                                />
                                <span className={styles.foodtypetext}>{category}</span>
                            </div>
                        </Link>
                    ))}
                </div>


                <div className={styles.menulist}>

                    {menuItems.map((category) => (
                        category.type_data.map((item) => (
                            <div key={item.id} className={styles.menuitem}>
                                <Link className={styles.menuimage} href={`/home/${item.slug}`}>
                                    <img className={styles.menuimage} src={item.attachment} alt={item.name} />
                                </Link>
                                <div className={styles.boxdecor}></div>
                                <div className={styles.menucontent}>
                                    <span className={styles.menuname}>{item.name}</span>
                                    <span className={styles.menucategory}>{category.type_name}</span>
                                    <span className={styles.menuprice}>{item.price.toFixed(3)} KWD</span>
                                </div>
                            </div>
                        ))
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
        </div >

    );

};
