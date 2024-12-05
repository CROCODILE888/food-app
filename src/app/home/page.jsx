// app/home/page.js
'use client'
import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import { getMenuItems, getAreas, getUserAreas, getInitialData } from '@/shared/util/apiService';
import { Loader } from '@/components/Loader/Loader';
import Link from 'next/link';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function HomePage() {

    const [menuItems, setMenuItems] = useState([]);
    const [areas, setAreas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [selectedOption, setSelectedOption] = useState(null); // Options: null, 'delivery', 'pickup'

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
            if (savedArea.area.area) {
                const area = {
                    id: savedArea.area.id,
                    title: `${savedArea.area.name}, ${savedArea.area.area}`, // Normalize data
                }
                setArea(area);
                setSelectedOption(savedArea.option);
                return;
            }
            setArea(savedArea.area);
            setSelectedOption(savedArea.option);
        }
    }, []);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
                const typeNames = items.map((category) => category.type_name);
                setCategories(typeNames);
            } catch (error) {
                setError((error).message);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);

    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            setIsLoggedIn(true)
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setUserName(loginData.customer.name || '');
            fetchUserAreas(loginData?.customer?.id, loginData?.customer?.session_token);
        } else {
            fetchAreas();
        }
    }, []);

    const [userAreas, setUserAreas] = useState([]);
    const [userOGAreas, setOGUserAreas] = useState([]);


    const fetchUserAreas = async (customerId, sessionToken) => {
        try {
            const data = await getUserAreas(customerId, sessionToken);
            setOGUserAreas(data?.data?.addresses);
            setUserAreas(data?.data?.addresses.map(addr => ({
                id: addr.id,
                title: `${addr.name}, ${addr.area}`, // Normalize data
            })));
        } catch (error) {
            console.error(error);
        }
    };

    // Handle selection of Delivery/Pickup and toggle back to Find Food if deselected
    const handleOptionClick = (option) => {
        setSelectedOption(prevOption => (prevOption === option ? null : option));
    };

    const displayedCategories = categories.slice(0, 3);

    const [area, setArea] = useState({});

    const handleChange = (e) => {
        const selectedTitle = e.target.value;
        const selectedArea = (selectedOption === 'pickup' ? pickupAreas : isLoggedIn ? userAreas : areas)
            .find(area => area.title === selectedTitle);
        setArea(selectedArea); // Store the selected area object

        if (selectedOption === 'pickup') {
            const areaObject = { area: selectedArea, option: selectedOption };
            localStorage.setItem('selectedAreaWithOption', JSON.stringify(areaObject));
            return;
        }
        if (isLoggedIn) {
            const area = userOGAreas.find(area => area.id === selectedArea.id);
            const areaObject = { area: area, option: selectedOption }
            localStorage.setItem('selectedAreaWithOption', JSON.stringify(areaObject)); // Persist to localStorage            
            return;
        }
        const areaObject = { area: selectedArea, option: selectedOption }
        localStorage.setItem('selectedAreaWithOption', JSON.stringify(areaObject)); // Persist to localStorage
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 300,
                width: 250,
            },
        },
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
                    {
                        selectedOption !== null &&
                        <div className={styles.blockitem_big}>
                            <FormControl variant="standard" fullWidth>
                                <InputLabel id="area-select-label">
                                    {selectedOption === 'pickup' ? 'Select Pickup Areas' : 'Select Delivery Areas'}
                                </InputLabel>

                                <Select
                                    name="area"
                                    value={area ? area.title : ''}
                                    onChange={handleChange}
                                    displayEmpty
                                    required
                                    placeholder={`Find ${selectedOption === 'pickup' ? 'Pickup Areas' : 'Delivery Areas'}`}
                                    MenuProps={MenuProps}
                                >
                                    <MenuItem value="" disabled>
                                        {`Select ${selectedOption === 'pickup' ? 'Pickup Area' : 'Delivery Area'}`}
                                    </MenuItem>
                                    {(selectedOption === 'pickup' ? pickupAreas : isLoggedIn ? userAreas : areas).map((area) => (
                                        <MenuItem key={area.id} value={area.title}>
                                            {selectedOption === 'pickup' ?
                                                <a
                                                    target='_blank'
                                                    // className='aTag'
                                                    style={{
                                                        color: 'rgb(36, 98, 145)',
                                                        textDecoration: 'underline',
                                                        textDecorationColor: 'blue',
                                                        cursor: 'pointer',
                                                    }}
                                                    href={area.title}
                                                    rel='noopener noreferrer'
                                                >Open maps for location
                                                </a>
                                                : area.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    }
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
                            <Link key={item.id} className={styles.menuitem} href={`/home/${item.slug}`}>
                                <div className={styles.menuitem}>
                                    <img className={styles.menuimage} src={item.attachment} alt={item.name} />
                                    <div className={styles.boxdecor}></div>
                                    <div className={styles.menucontent}>
                                        <span className={styles.menuname}>{item.name}</span>
                                        <span className={styles.menucategory}>{category.type_name}</span>
                                        <span className={styles.menuprice}>{item.price.toFixed(3)} KWD</span>
                                    </div>
                                </div>
                            </Link>

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
