// components/AuthForm.js'
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import styles from './AuthForm.module.css';

const AuthForm = ({ isLogin, onSubmit }) => {
  return (
    <div className={styles.container}>

      <div className={styles.logo}>
        <Image
          src="/secret-oven.svg"
          alt="Logo"
          width={100}
          height={100} />
      </div>

      <div className={styles.tabContainer}>
        <Link href="/login">
          <button className={isLogin ? styles.activeTab : styles.tab}>Login</button>
        </Link>
        <Link href="/signup">
          <button className={!isLogin ? styles.activeTab : styles.tab}>Sign-up</button>
        </Link>
      </div>

      <form onSubmit={onSubmit} className={styles.formContainer}>

        {!isLogin && <input type="text" placeholder="Full Name" className={styles.input} />}

        <input type="email" placeholder="Email Address" className={styles.input} />
        <input type="password" placeholder="Password" className={styles.input} />

        {!isLogin && <p className={styles.terms}>By signing up, you agree to our Terms of Service</p>}
        <a href="#" className={styles.forgotPassword}>{isLogin ? 'Forgot Password?' : ''}</a>
        <button type="submit" className={styles.submitButton}>{isLogin ? 'Login' : 'Sign Up'}</button>

        <div className={styles.orContainer}>
          <span>or</span>
        </div>

        <button className={styles.socialButton}>Sign In with Facebook</button>
        <button className={styles.socialButton}>Sign In with Google</button>

        <p className={styles.accountOrNot}>{isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Link href={isLogin ? "/signup" : "/login"}>{isLogin ? 'Sign Up' : 'Log in'}</Link></p>
      </form>
    </div>
  );
};

export default AuthForm;