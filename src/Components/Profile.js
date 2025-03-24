import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS/Profile.module.css';
import Navbar from '../Components/Navbar';
import ProfileFilter from './Profile_filter';
// import profile from '../assets/profile.png';
import Loader from './Loader';

function Profile() {
  const [filterSelected, setFilterSelected]= useState('Photographs');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const token=localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const [personDetails, setPersonDetails]=useState(null);
  const [isDelAcc, setIsDelAcc] = useState(false);
  const [isFollowersOpen, setIsFollowersOpen] = useState(false);
  const [isFollowingOpen, setIsFollowingOpen] = useState(false);
  const [personsList, setPersonsList] =useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchUserDetails();
    }
  }, [userId]);

    const getUserId = async () => {
      if (!token || token === "null" || token.trim() === "") {
        console.error("No valid token found!");
        window.location.href="/login"; // Don't make the request if token is invalid
      }
      try {
        const result = await fetch("http://localhost:8080/api/user/getUserId", {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!result.ok) throw new Error("Failed to fetch user ID");
        const id = await result.text();
        setUserId(id);
      } catch (error) {
        console.error(error.message);
      }
    };
    
    const fetchUserDetails = async () => {
      setIsLoading(true);
      if (!userId) {
        console.error("User ID is missing!");
        return;
      }
    
      try {
        const response = await fetch("http://localhost:8080/api/user/getDetails", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });
    
        if (!response.ok) {
          console.error("Failed to fetch person details. Status:", response.status);
          return;
        }
    
        const data = await response.json();
        setPersonDetails(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
      setIsLoading(false);
    };


  const getPeoplesList=async(type)=>{
    try{
    const response=await fetch("http://localhost:8080/api/user/peoplesList",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({userId,type})
    })

    if(response.ok)
    {
      const data = await response.json();
      setPersonsList(data);
    }
    }catch(error){
      console.log(error);
    }
  }

  const getAccDetails = (user) => {
    navigate("/personProfile", {
      state: { uid: user }
    });
  };

  
  const handleFilter=(e)=>{
    setFilterSelected(e.target.value);
  }

  // useEffect(()=>{
  //   console.log(filterSelected);
  // },[]);

  const handleLogout=()=>{
    setIsLogout(true);
  }

  const confirmLogout=async()=>{
    const token=localStorage.getItem('token');
    if (!token) {
      console.error("No token found");
      return;
    }
    const response=await fetch('http://localhost:8080/api/user/logout',{
      method: 'POST',
      headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if(response.ok)
    {
      localStorage.removeItem('token');
      window.location.href='/';
    }

    console.log("logging out");
  }

  const handleFollowers=async()=>{
    console.log("followers");
    await getPeoplesList("followers");
    setIsFollowersOpen(true);
  }

  const handleFollowing=async()=>{
    console.log("followings");
    await getPeoplesList("followings");
    setIsFollowingOpen(true);
  }

  const handleDelete=()=>{
    setIsDelAcc(true);
  }

  const confirmDelete=async()=>{
    const response=await fetch("http://localhost:8080/api/user/delete",{
      method:'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userId})
    });

    if(response.ok)
    {
      window.location.href='/'
      console.log("deleted successfully");
    }

    console.log("delete account");
  }

  const closeOverlay = () => {
    setIsFollowersOpen(false);
    setIsFollowingOpen(false);
    setIsDelAcc(false);
    setIsLogout(false);
    setPersonsList([]);
  };

  if (isLoading) {
    return <Loader/>; // Display loader while loading
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.nav}><Navbar/></div>
      <div className={styles.top_bar}></div>
      <div className={styles.image}>
        <p className={styles.letter}>{(Array.from(personDetails?.username ? `${personDetails.username}` : 'username')[0]).toUpperCase()}</p>
      </div>
      <button className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>&#9776;</button>
      <div className={styles.options}>
        <ul className={`${styles.list}   ${isMenuOpen ? styles.show : ""}`}>
          <li className={styles.menu}><button className={styles.btn} onClick={handleLogout}>Logout</button></li>
          <li className={styles.menu}><button className={styles.btn} onClick={handleFollowing}>Followings</button></li>
          <li className={styles.menu}><button className={styles.btn} onClick={handleFollowers}>Followers</button></li>
          <li className={styles.menu}><button className={styles.btn} onClick={()=>{window.location.href ='/upload'}}>Upload</button></li>
          <li className={styles.menu}><button className={styles.btn} onClick={handleDelete}>Delete Account</button></li>
        </ul>
      </div>
      <div className={styles.username}>
        <p className={styles.text}>{personDetails?.username ? `@${personDetails.username}` : '@username'}</p>
      </div>
      <div className={styles.filters}>
        <input type='button' value='Photographs' className={`${styles.filter} ${filterSelected==='Photographs' ? styles.active : ''}`} onClick={handleFilter}/>
        <input type='button' value='Illustrations' className={`${styles.filter} ${filterSelected==='Illustrations' ? styles.active : ''}`} onClick={handleFilter}/>
        <input type='button' value='Saved Images' className={`${styles.filter} ${filterSelected==='Saved Images' ? styles.active : ''}`} onClick={handleFilter}/>
      </div>
      <div className={styles.grid}>
        <ProfileFilter type={filterSelected}  uid={null}/>
      </div>
      {(isFollowersOpen || isFollowingOpen) && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <button className={styles.closeBtn} onClick={closeOverlay}>×</button>
            <h2>{isFollowersOpen ? "Followers" : "Followings"}</h2>
            <ul className={styles.personList}>
            {personsList.map((user, index) => (
                <li key={index} className={styles.person}>
                  <div className={styles.des_box} onClick={() => getAccDetails(user.personId)}>
                    <p className={styles.name}>{user.username}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}

        {(isLogout || isDelAcc) && (
        <div className={styles.overlay}>
          <div className={styles.overlayContent}>
            <button className={styles.closeBtn} onClick={closeOverlay}>×</button>
            <h2>{isLogout ? "Logout?" : "Delete Account?"}</h2>
            <p className={styles.msg}>{isLogout? "Confirm Logout": "Are your sure to delete you account?"}</p>
            <button className={styles.button} onClick={isLogout? confirmLogout : confirmDelete}>{isLogout? "Yes": "Confirm Delete"}</button>
          </div>
        </div>
        )}

    </div>
  )
}

export default Profile
