import React, { useEffect, useState } from 'react';
import styles from '../CSS/PersonProfile.module.css';
import { useLocation } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import like from '../assets/heart.png';
import work from '../assets/work.png';
import ProfileFilter  from './Profile_filter';
// import profile from '../assets/profile.png';
import Loader from './Loader';

function PersonProfile() {

  const [isFollow, setIsFollow]=useState(false);
  const token=localStorage.getItem("token");
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const { uid } = location.state;
  // const uid='10101';
  const [filterSelected, setFilterSelected]= useState('Photographs');
  const [personDetails, setPersonDetails]=useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    getUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchPersonDetails();
      checkFollowStatus();
    }
  }, [userId]);


  const fetchPersonDetails = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:8080/api/user/personDetails", {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ userId: String(uid) })  // Send userId in request body
    });

    if (response.ok) {
      const data = await response.json();
      setPersonDetails(data); // Assuming the API returns an array
    } else {
      console.error("Failed to fetch person details");
    }
    setIsLoading(false);
  };

  const getUserId=async()=>{
    if (!token || token === "null" || token.trim() === "") {
      console.error("No valid token found!");
      window.location.href="/login"; // Don't make the request if token is invalid
    }
    const result=await fetch("http://localhost:8080/api/user/getUserId",{
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });

    if(result.ok)
    {
      const id = await result.text();
      setUserId(id);
    }
  }

  const handleFilter=(e)=>{
    setFilterSelected(e.target.value);
  }

  const checkFollowStatus=async()=>{
    if (!userId) return;
    const response=await fetch('http://localhost:8080/api/user/checkFollow',{
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({userId, uid})
    });

    if(response.ok)
    {
      setIsFollow(true);
    }
    else{
      setIsFollow(false);
    }
  }

  const handleFollow=async()=>{
    if (!userId) return;
    const response= await fetch("http://localhost:8080/api/user/follow",{
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({userId, followId: uid})
    });

    if(response.ok)
    {
      console.log('follow');
      setIsFollow(true);
    }
  }

  const handleUnfollow=async()=>{
    if (!userId) return;
    const response= await fetch("http://localhost:8080/api/user/unfollow",{
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({userId, unfollowId: uid})
    });

    if(response.ok)
    {
      console.log('unfollow');
      setIsFollow(false);
    }
  }

  if (isLoading) {
    return <Loader/>; // Display loader while loading
  }

  return (
    <div className={styles.main_container}>
      <div className={styles.nav}> 
            <Navbar/>
        </div>
        <div className={styles.top_circle}></div>
        <div className={styles.top_bar}></div>
        <div className={styles.image}>
          {/* <img src={personDetails[0]?.profile_photo || profile} alt='i' className={styles.img}/> */}
          <p className={styles.letter}>{(Array.from(personDetails[0]?.username ? `${personDetails[0].username}` : 'username')[0]).toUpperCase()}</p>
        </div>
        <p className={styles.username}>{personDetails[0]?.username ? `@${personDetails[0].username}` : '@username'}</p>
        <div className={styles.items}>
          <div className={styles.options}>
            <button className={styles.btn} onClick={isFollow? handleUnfollow : handleFollow}>{isFollow? 'Unfollow': 'Follow'}</button>
          </div>
          <div className={styles.like_box}>
            <img src={like} alt='likes' className={styles.likes}/>
            <p className={styles.txt}>{personDetails[0]?.likes || 0}</p>
          </div>
          <div className={styles.work_box}>
            <img src={work} alt='likes' className={styles.likes}/>
            <p className={styles.txt}>{personDetails[0]?.work || 0}</p>
          </div>
        </div>
        <div className={styles.filters}>
          <input type='button' value='Photographs' className={`${styles.filter} ${filterSelected==='Photographs' ? styles.active : ''}`} onClick={handleFilter}/>
          <input type='button' value='Illustrations' className={`${styles.filter} ${filterSelected==='Illustrations' ? styles.active : ''}`} onClick={handleFilter}/>
        </div>
        <div className={styles.grid}><ProfileFilter type={filterSelected} uid={uid}/></div>
    </div>
  )
}

export default PersonProfile
