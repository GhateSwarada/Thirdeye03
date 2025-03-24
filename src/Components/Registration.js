import React, { useState } from 'react';
import styles from '../CSS/Registration.module.css';
import google from '../assets/google_logo.png';
// import { Link } from 'react-router-dom';


function Registration() {

    const [regiData, setRegiData] = useState({
        fname: '',
        lname: '',
        username: '',
        email: '',
        password: '',
        conpassword: ''
    });

    const [isPopupVisible, setIsPopupVisible] =useState(false);

    const handleChange=(e)=>{
        setRegiData({...regiData, [e.target.name]: e.target.value});
    }

    const handlePopup=()=>{
        window.location.href='/login';
    }

    const handleRegi = async (e) => {
        e.preventDefault();
    
        // Clear previous error messages
        let err1 = document.getElementById("error1");
        let err2 = document.getElementById("error2");
        let err3 = document.getElementById("error3");
        err1.innerHTML = "";
        err2.innerHTML = "";
        err3.innerHTML = "";
    
        // Validation logic
        let emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        let hasError = false;
    
        if (!emailRegex.test(regiData.email)) {
            err1.innerHTML = "Invalid email!";
            hasError = true;
        }
    
        if (regiData.password.length < 8) {
            err2.innerHTML = "Password should be of at least 8 characters!";
            hasError = true;
        }
    
        if (regiData.password !== regiData.conpassword) {
            err3.innerHTML = "Password & Confirm password are not the same!";
            hasError = true;
        }
    
        // If no errors, submit the form
        if (!hasError) {
            console.log("Registration successful");
            const fname=regiData.fname;
            const lname=regiData.lname;
            const username=regiData.username;
            const password=regiData.password;
            const email=regiData.email;
            try{
                const response= await fetch("http://localhost:8080/api/user/register",{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({fname,lname,username,password,email}),
                });

                if(response.ok){
                    setIsPopupVisible(true);
                }else{
                    window.href='/registration';
                }
            }
            catch(error){
                console.log(error);
            }
        }
    };
  return (
    <div className={styles.main_body}>
        {isPopupVisible && (
            <div className={styles.popup}>
                <div className={styles.popup_box}>
                    <p className={styles.head}>Account Created Successfully</p>
                    <button className={styles.popup_btn} onClick={handlePopup}>
                        Login
                    </button>
                </div>
            </div>
        )}
        <div className={styles.circle}></div>
        <div className={styles.top_circle}></div>
        <div className={styles.right_side}>
            <div className={styles.overlay}>
                <div className={styles.heading}>
                    <p className={styles.title}><h1>Create Your Account</h1></p>
                </div>
                <form className={styles.regiform} onSubmit={handleRegi}>
                    <input type='text' className={`${styles.regi_input} ${styles.first}`} placeholder='First name' value={regiData.fname} onChange={handleChange} required name='fname'/>
                    <input type='text' className={styles.regi_input} placeholder='Last name' value={regiData.lname} onChange={handleChange} required name='lname'/>
                    <input type='text' className={styles.regi_input} placeholder='Enter username' value={regiData.username} onChange={handleChange} required name='username'/>
                    <input type='email' className={styles.regi_input} placeholder='Enter email' value={regiData.email} onChange={handleChange} required name='email'/>
                    <p className={styles.error} id='error1'></p>
                    <input type='password' className={styles.regi_input} placeholder='Enter password' value={regiData.password} onChange={handleChange} required name='password'/>
                    <p className={styles.error} id='error2'></p>
                    <input type='password' className={styles.regi_input} placeholder='Confirm password' value={regiData.conpassword} onChange={handleChange} required name='conpassword'/>
                    <p className={styles.error} id='error3'></p>
                    <input type='submit' value='Create' className={styles.btn}/>
                </form>
            </div>
        </div>
        <div className={styles.left_side}>
            <p className={styles.google}><img src={google} alt='google_logo' className={styles.google_logo}/><a href='https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ifkv=AeZLP99AUMmKP4uWVN5khc_zWWY-IRehNnh0IqznMpiID_25cOnMq9l850t6H5EArrWl0-51g62I6g&rip=1&sacu=1&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1947317694%3A1734529077539713&ddm=1' className={styles.googleauth}>Continue with Google</a></p>
        </div>
    </div>
  )
}

export default Registration
