import React, { useEffect, useState } from 'react';
import styles from '../CSS/Profile_filter.module.css';
import del from '../assets/delete.png';
import { useNavigate } from 'react-router-dom';

function Profile_filter({type, uid}) {
    const token=localStorage.getItem("token");

    const [images, setImages] = useState([]);
    const [userId, setUserId] = useState(null);
    let user_id;
    const navigate = useNavigate();
    
    useEffect(()=>{
      getUserId();
    },[]);

    useEffect(()=>{
      if(userId || uid)
      {
        fetchImages(type);
      }
    },[type, userId, uid]);

    const getUserId=async()=>{
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
    }

    const fetchImages=async(type)=>{
      // const user_id = uid || userId;
      if(uid!=null)
      {
        user_id=uid;
      }
      else{
        user_id=userId;
      }
      try{
        let response;
        if(type==="Saved Images")
        {
          response=await fetch("http://localhost:8080/api/images/savedImages",{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({userId: String(userId)})
          });
        }
        else{
          response=await fetch("http://localhost:8080/api/images/imagesPerType",{
            method:"POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({user_id,type})
          });
        }
        if(response.ok)
        {
          const data = await response.json();
          setImages(data); // Ensure it's an array
        }
        else{
          console.log("error");
        }
        
      } catch (error) {
        console.log(error);
        setImages([]); // Fallback to empty array on error
      }
    }

    const getImageDetails=(image_id)=>{
      navigate("/details", {
        state: { imageId: image_id }
      });
    }

    const handleDelete=async(img_id)=>{
      const response=await fetch("http://localhost:8080/api/images/deleteImage",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({image_id: String(img_id)})
      });

      if(response.ok)
      {
        window.location.href="/profile";
      }

    }

  return (
    <div className={styles.container}>
      <div className={styles.bento_grid}>
        {images.map((image, index) => (
          <div 
            className={`${styles.bento_grid_item} ${styles[image.layout]}`} 
            key={index}
            onClick={()=>getImageDetails(image.image_id)}
          >
            <img src={image.image_url} alt={image.img_name} />
            {uid==null ?
            <div className={styles.overlay}>
            <div className={styles.box}>
              <span className={styles.icon_div} onClick={() => handleDelete(image.image_id)}><img className={styles.icon} src={del} alt="delete"/></span>
            </div>
            </div>
            : ""
            }
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile_filter
