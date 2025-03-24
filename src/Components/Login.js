import React, { useState } from 'react';
import styles from '../CSS/Login.module.css';
import { Link } from 'react-router-dom';

function Login() {
    const [loginform, setLoginform] =useState(
        {
            username: '',
            password: ''
        }
    );

    const handleChange =(e) =>{
        setLoginform({...loginform, [e.target.name]: e.target.value});
    }

    const handleLogin = async (e) => {
      e.preventDefault();
    
      if (loginform.username === '' || loginform.password === '') {
        document.getElementById('error').innerHTML = "Please enter all the details!";
      } else {
        const username = loginform.username;
        const password = loginform.password;
    
        try {
          const response = await fetch("http://localhost:8080/api/user/login", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
          });
    
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/';
          } else {
            // Handle login failure
            const errorText = await response.text();
            document.getElementById('error').innerHTML = errorText || "Login failed. Incorrect Username or Password.";
          }
        } catch (error) {
          document.getElementById('error').innerHTML = "An error occurred. Please try again later.";
        }
      }
    };

  return (
    <div className={styles.container}>
      <div className={styles.circle}></div>
      <div className={styles.btm_circle}></div>
      <div className={styles.loginbox}>
      <div className={styles.login_form}>
            <h1 className={styles.heading}>Welcome back!</h1>
            <p className={styles.regi}>Don't have an account?<Link to="/registration" className={styles.regi_link}> Register here!</Link></p>
            <form onSubmit={handleLogin}>
                <input type='text' placeholder='Enter your username' name='username' value={loginform.username} onChange={handleChange} className={`${styles.input_txt} ${styles.first}`}/>
                <br/>
                <input type='password' placeholder='Enter your password' name='password' value={loginform.password} onChange={handleChange} className={styles.input_txt}/>
                <br/>
                <input type='submit' value='Login' className={styles.loginbtn} />
                <p className={styles.error} id='error'></p>
                <Link to='/forgetPassword' className={styles.forgetpsswd}>Forget Password?</Link>
            </form>
        </div>
      </div>
    </div>
  )
}

export default Login
