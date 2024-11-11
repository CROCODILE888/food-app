// app/cart/page.js
'use client'

import Link from 'next/link';
import styles from './cart.module.css';

const Cart = () => {
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
                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/123.png" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Samosa</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>1.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/26.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Pakoda</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>1.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/20.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Blueberry Cheesecake</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>13.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/27.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Chocolate Pudding</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>91.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/22.jpg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Salad</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>38.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/23.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Pie</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>12.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/24.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Cake</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>221.000 KWD</span>
                        </div>
                    </div>

                    <div className={styles.cartitem}>
                        <img className={styles.cartimage} src="/25.jpeg" />
                        <div className={styles.cartcontent}>
                            <div className={styles.carttext}>
                                <span className={styles.cartname}>Kachori</span>
                            </div>
                            <div className={styles.amount}>
                                <img className={styles.qtyicon} src="/minus.svg" />
                                <span className={styles.qty}>1</span>
                                <img className={styles.qtyicon} src="/plus.svg" />
                            </div>
                            <span className={styles.cartprice}>0.300 KWD</span>
                        </div>
                    </div>
                </div>

                <div className={styles.couponbox}>
                    <input className={styles.coupontext} type="text" placeholder="Code Here" />
                    <div className={styles.couponbutton}>Enter Code</div>
                </div>

                <div className={styles.billbox}>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Subtotal</span>
                        <span className={styles.metric}>17.970 kWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Other Charges</span>
                        <span className={styles.metric}>1.000 KWD</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.metricrow}>
                        <span className={styles.metrictitle}>Total</span>
                        <span className={styles.metric}>18.970 kWD</span>
                    </div>
                    <div className={styles.line}></div>
                </div>

                <Link className={styles.button} href="/checkout">
                    <div className={styles.button}>
                        <span className={styles.buttontitle}>Checkout</span>
                    </div>
                </Link>

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

export default Cart;
