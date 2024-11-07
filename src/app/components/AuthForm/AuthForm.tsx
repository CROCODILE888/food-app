// components/AuthForm.js'
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AuthForm.module.css';

const AuthForm = ({ isLogin, onSubmit, success, message }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // SignUp
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (!isLogin) {
      formData.append('name', fullName);
      formData.append('email', email);
    }
    formData.append('phone', phone);
    formData.append('password', password);

    onSubmit(formData); // Pass phone and password to onSubmit function
  };

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

      <form onSubmit={handleSubmit} className={styles.formContainer}>

        {!isLogin && <input type="text"
          placeholder="Full Name"
          className={styles.input}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)} />}
        {!isLogin && <input type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)} />}

        <input
          type="tel"
          placeholder="Phone no."
          maxLength={8}
          className={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)} />

        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)} />

        {!isLogin && <p className={styles.terms}>By signing up, you agree to our Terms of Service</p>}
        {!success && <p style={{ color: 'red' }}>{message}</p>}
        <a href="#" className={styles.forgotPassword}>{isLogin ? 'Forgot Password?' : ''}</a>
        <button type="submit" className={styles.submitButton}>{isLogin ? 'Login' : 'Sign Up'}</button>

        <div className={styles.orContainer}>
          <span>or</span>
        </div>

        <button className={styles.socialButton}>Sign In with Facebook</button>
        <button className={styles.socialButton}>Sign In with Google</button>

        <p className={styles.accountOrNot}>{isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Link style={{ color: 'red' }} href={isLogin ? "/signup" : "/login"}>{isLogin ? 'Sign Up' : 'Log in'}</Link></p>
      </form>
    </div>
  );
};

export default AuthForm;