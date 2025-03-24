import React, { useState } from 'react';
import style from'../CSS/Footer.module.css';
import { Link } from 'react-router-dom';
import insta from '../assets/insta.png';
import yt from '../assets/yt.png';

function Footer() {

  const [contactForm, setContactForm] = useState(
    {
      email: '',
      message: ''
    }
);

const handleChange =(e) =>{
  setContactForm({...contactForm, [e.target.name]: e.target.value});
}


  const handleFeedback=async(e)=>{
    e.preventDefault();
    let email=contactForm.email;
    let message=contactForm.message;
    const response=await fetch('http://localhost:8080/api/contact/add',{
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email,message})
    })

    if(response.ok)
    { 
      console.log("form submitted");
    }
  }

  return (
    <div className={style.footer_container}>
      <div className={style.circle}></div>
      <div className={style.top_circle}></div>
      <div className={style.flex_container}>
        <div className={style.left_side}>
          <p className={style.thanktext}>Thank You!</p>
          <div className={style.logos}>
            <Link to="https://www.youtube.com/@thirdeye0307"><img src={yt} alt='youtube' className={style.yt}/></Link>
            <Link to="https://www.youtube.com/@thirdeye0307"><img src={insta} alt='instagram' className={style.inst}/></Link>
          </div>
          <p className={style.name}>Thirdeye.03</p>
          <p className={style.dev}>Developed by Swarada Ghate</p>
        </div>
        <div className={style.right_side}>
          <p className={style.heading}>Give us Feedback!</p>
          <form onSubmit={handleFeedback} className={style.feedbackForm}>
            <input type='email' className={style.input} placeholder='Enter email' onChange={handleChange} name="email"value={contactForm.email}/>
            <br/>
            <input type='text' className={style.input} placeholder='Enter your message' onChange={handleChange} name="message" value={contactForm.message}/>
            <br/>
            <input type='submit' value='Submit' className={style.btn}/>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Footer
