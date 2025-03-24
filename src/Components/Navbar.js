import React, { useEffect, useState } from 'react';
import style from '../CSS/Navbar.module.css';
import { Link } from 'react-router-dom';

function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState("false");

  const [menuOpen, setMenuOpen]= useState(false);

  useEffect(()=>{
    const token=localStorage.getItem("token");
    setIsLoggedIn(!!token);
  },[]);


  return (
    <div>
      <div className={style.main}>
        <div className={style.logo_img}>
            <p className={style.logo}>Thirdeye.03</p>
        </div>
        <div className={style.menubar}>
          <button className={style.hamburger} onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
            <ul className={`${style.nav} ${menuOpen ? style.show : ""}`}>
                <li className={style.item}><Link to="/" className={style.menu}>Home</Link></li>
                <li className={style.item}><Link to="/about" className={style.menu}>About</Link></li>
                <li className={style.item}><Link to="/explore" className={style.menu}>Explore</Link></li>
                {isLoggedIn? (<li className={style.item}><Link to="/profile" className={style.menu}>Profile</Link></li>)
                :(<li className={style.item}><Link to="/login" className={style.menu}>Login</Link></li>)
                }
                <li className={style.item}><Link to="/upload" className={style.menu}>Upload</Link></li>
            </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar

