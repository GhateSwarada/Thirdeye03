import React from "react";
import style from "../CSS/About.module.css";
import logo from '../assets/logo.png';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
function About() {
  return (
    <div className={style.main_container}>
      <div className={style.nav}> 
        <Navbar/>
      </div>
      <div className={style.circle}></div>
      <div className={style.top_circle}></div>
      <div className={style.box}>
        <div className={style.images}>
          <img src={logo} alt="logo" className={style.logo}/>
        </div>
        <div className={style.info}>
          <p className={style.heading}>About us</p>
          <hr className={style.line}/>
          <br/>
          <p className={style.des}>
            Hey Guys <br/> I am Vinit Mhatre as known as Thirdeye03 here. Like you only
            I'm also passionate about my hobby of capturing the irreversible
            moments in life and bringing it in front of you in my way. This
            website is nothing but the Platform for us friends to upskill
            ourselves. <br/> <br/> We invite creators of all ages to share their unique
            perspectives and experiences through captivating visuals. Whether
            you're a young creative or a seasoned storyteller, our platform is
            designed for you to showcase your imagination and connect with
            like-minded individuals. <br/> <br/> Upload your most epic moments Discover and
            explore content from diverse creators Engage with a vibrant community
            that's all about collaboration and growth Join our movement and let's
            build a supportive ecosystem that celebrates creativity and
            self-expression!
          </p>
        </div>
      </div>
      <div className={style.footer}>
        <Footer/>
      </div>
    </div>
  );
}

export default About;
