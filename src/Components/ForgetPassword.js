import React, { useState } from 'react';
import styles from '../CSS/ForgetPassword.module.css';
import { Link } from 'react-router-dom';

function ForgetPassword() {

  const [forgetPassData, setForgetPassData] = useState(
    {
      email: '',
      username: '',
      newPass: '',
      conPass: ''
    }
  );

  const handleChange=(e)=>{
    setForgetPassData({...forgetPassData, [e.target.name]:e.target.value});
  }

  const handleSubmit=async()=>{
    const password=forgetPassData.newPass;
    const conPassword=forgetPassData.conPass;
    const email=forgetPassData.email;
    const username=forgetPassData.username;

    let err1=document.getElementById('err1');
    let err2=document.getElementById('err2');
    let err3=document.getElementById('err3');
    let err4=document.getElementById('err4');
    let err=document.getElementById('err');

    let isError=false;

    let emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;

    if(password!==conPassword)
    {
      err4.innerHTML='Password and Confirm password does not match!'
      isError=true;
    }
    if(!emailRegex.test(email))
    {
      err1.innerHTML='Invalid email!'
    }
    if(password.length<8)
    {
      err3.innerHTML='Password should be of 8 characters!'
    }
    if(username==null || username=='')
    {
      err2.innerHTML='Password should be of 8 characters!'
    }


    if(!isError)
    {
      try{
        const response=await fetch('http://localhost:8080/api/user/updatePassword',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email, username, password})
        });

        if(response.ok)
        {
          window.location.href='/login';
        }
        else{
          const errorText = await response.text();
          err.innerHTML=errorText ||'There is an error!';
        }

      }
      catch(error){
        err.innerHTML='Something went wrong!'
      }
      console.log('password set');
    }
  }


  return (
    <div className={styles.main_container}>
      <div className={styles.circle}></div>
      <div className={styles.bottom_circle}></div>
      <div className={styles.form_box}>
        <p className={styles.heading}>Set New Password</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type='email' className={styles.input} onChange={handleChange} name='email' value={forgetPassData.email} placeholder='Enter your email'/>
          <p className={styles.error} id='err1'></p>
          <input type='text' className={styles.input} onChange={handleChange} name='username' value={forgetPassData.username} placeholder='Enter your username'/>
          <p className={styles.error} id='err2'></p>
          <input type='password' className={styles.input} onChange={handleChange} name='newPass' value={forgetPassData.newPass} placeholder='Create password'/>
          <p className={styles.error} id='err3'></p>
          <input type='password' className={styles.input} onChange={handleChange} name='conPass' value={forgetPassData.conPass} placeholder='Confirm Password'/>
          <p className={styles.error} id='err4'></p>
          <button type='submmit' className={styles.btn}>Submit</button>
        </form>
        <p className={styles.error} id='err'></p>
        <p className={styles.text}><Link to='/login' className={styles.link}>Login Here!</Link></p>
      </div>
    </div>
  )
}

export default ForgetPassword
