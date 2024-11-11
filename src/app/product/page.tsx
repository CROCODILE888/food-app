// app/product/page.js
'use client'
import styles from './product.module.css';
import Link from "next/link";

const ProductPage = () => {
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
                    <img className={styles.sysico} src="/chevron-left.svg" />
                    <span className={styles.title}>Product Details</span>
                </div>

                <div className={styles.mainitem}>
                    <img className={styles.mainimage} src="/123.png" />

                    <div className={styles.maincontent}>
                        <div className={styles.maintext}>
                            <span className={styles.mainname}>Samosa</span>
                            <span className={styles.maindescription}>One of the best indian snacks, healthy and good to eat. have fun enjoy. made this page in 30 mins. so expect bugs.</span>
                        </div>
                        <div className={styles.amount}>
                            <img className={styles.qtyicon} src="/minus.svg" />
                            <span className={styles.qty}>1</span>
                            <img className={styles.qtyicon} src="/plus.svg" />
                        </div>
                        <span className={styles.mainprice}>1.000 KWD</span>
                    </div>
                </div>

                <div className={styles.pagetitle}>
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
    )
}

export default ProductPage;
