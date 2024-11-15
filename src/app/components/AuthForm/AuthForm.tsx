// components/AuthForm.js'
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './AuthForm.module.css';
import { AuthFormProps } from '@/shared/interfaces/PropsInterfaces';
import ForgotPassword from '../Forgot Password/ForgotPassword';

const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onSubmit, success, message }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [forgotPassword, setForgotPassword] = useState(false);

  // SignUp
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (!isLogin) {
      formData.append('name', fullName);
      formData.append('email', email);
    }
    formData.append('phone', phone);
    formData.append('password', password);

    onSubmit(formData);
  };

  const handleGoBack = () => {
    const previousPage = document.referrer; // Get the previous page URL
    if (previousPage) {
      window.history.back(); // Go back in history if there's a referrer
    } else {
      window.location.href = '/home'; // Redirect to home page if no referrer
    }
  };

  return (
    <div className={styles.container}>

      <div className={styles.pagetitle}>
        <button onClick={handleGoBack}>
          <img className={styles.sysico} src="/chevron-left.svg" />
        </button>
        <span className={styles.title}>Back</span>

      </div>
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

        {isLogin && <div onClick={() => setForgotPassword(true)} className={styles.forgotPassword}>Forgot Password?</div>}

        {forgotPassword && <ForgotPassword open={forgotPassword} onClose={() => setForgotPassword(false)} ></ForgotPassword>}
        <button type="submit" className={styles.submitButton}>{isLogin ? 'Login' : 'Sign Up'}</button>

        {/* <div className={styles.orContainer}>
          <span>or</span>
        </div>

        <button className={styles.socialButton}>Sign In with Facebook</button>
        <button className={styles.socialButton}>Sign In with Google</button> */}

        <p className={styles.accountOrNot}>{isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Link style={{ color: 'red' }} href={isLogin ? "/signup" : "/login"}>{isLogin ? 'Sign Up' : 'Log in'}</Link></p>
      </form>
    </div>
  );
};

export default AuthForm;