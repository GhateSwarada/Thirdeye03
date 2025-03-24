import React, { useEffect, useState } from 'react';
import styles from '../CSS/ImageDetails.module.css';
import Navbar from '../Components/Navbar';
// import img1 from "../assets/textimg2.jpg";
import { useLocation, useNavigate } from 'react-router-dom';
import like from '../assets/heart.png';
import download from '../assets/downloads.png';
import save from '../assets/bookmark.png';
import img from '../assets/image1.jpg';
import upload from '../assets/upload.png';
import Loader from './Loader';


function ImageDetails() {

  const token=localStorage.getItem("token");
  const location = useLocation();
  const { imageId } = location.state;
  const [images, setImages]= useState([]);
  const [userId, setUserId]=useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(()=>{
    console.log("Image ID in details page:", imageId);
    getImageDetails();
  },[imageId]);


  const getImageDetails=async()=>{
    setIsLoading(true);
    const response=await fetch("http://localhost:8080/api/images/imageDetails",{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({image_id: String(imageId)})
    });

    if(response.ok)
    {
      const data=await response.json();
      setImages(data);
    }
    else{
      console.log("Error while fetching information");
    }
    setIsLoading(false);
  }


  const getUserId=async()=>{
    const result=await fetch("http://localhost:8080/api/user/getUserId",{
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if(result.ok)
    {
      const id = await result.text();
      setUserId(id);
    }
  }

  // const handleFilter=(e)=>{
  //   setFilterSelected(e.target.value);
  // }



  const handleSave=async()=>{
    if(token==null)
      {
        window.location.href="/login";
      }
      else{
        const response=await fetch("http://localhost:8080/api/images/saveImage",{
          method:"POST",
          headers: {"Content-Type":"application/json"},
          body:JSON.stringify({userId,imageId})
        });
  
        if(response.ok)
        {
          window.location.href="/profile";
        }
      }
  }

  const getAccDetails = (user) => {
    navigate("/personProfile", {
      state: { uid: user }
    });
  };

  const handleLike=async()=>{
    const response=await fetch("http://localhost:8080/api/images/likeImage",{
      method:"POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({img_id: imageId})
    });

    if(response.ok)
    {
      console.log("Liked");
    }

  }

  const handleDownload=async(imageUrl,imageName)=>{
    try {
          const response = await fetch(imageUrl); // Fetch the image as a blob
          const blob = await response.blob();
          
          // Create an object URL for the blob
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = imageName; // Specify the download filename
          document.body.appendChild(link);
          link.click(); // Trigger the download
          document.body.removeChild(link);
        } catch (error) {
          console.error("Download failed:", error);
        }
  }
    
    // const images = [
    //     { url: img1, alt: "image1", layout: "vertical" , des:"This will be description or details of an image fetch from database entered by uploader. But what if the description is not there?", likes:80, username: 'username'},
    // ]

    if(isLoading)
    {
      return <Loader/>
    }

  return (
    <div className={styles.main_container}>
      <div className={styles.nav}>
        <Navbar/>
      </div>
      <div className={styles.circle}></div>
      <div className={styles.bottom_circle}></div>
      <div className={styles.container}>
        {images.map((image,index)=>(
          <div className={styles.content} key={index}>
            <div className={`${styles.image} ${image.layout==='vertical'? styles.vertical:""}`}>
              <div className={styles.section}>
                <div className={styles.top_section}>
                  <img src={image.img_url} alt={image.img_name} className={`${styles.mainImg} ${image.layout === "vertical" ? styles.vertical_image : ""}`}/>
                </div>
              </div>
            </div>
            <div className={styles.details}>
              <div className={styles.user_des}>
                <div className={styles.box}>
                  <div className={styles.user_img}><img src={upload} alt='u' className={`${styles.user} ${styles.upload}`}/></div>
                  <div className={styles.user_name}><p className={`${styles.user_name} ${styles.text}`}>{image.upload_date}</p></div>
                </div>
                <div className={styles.box} onClick={()=> getAccDetails(image.user_id)}>
                  <div className={styles.user_img}><p className={styles.letter}>{(Array.from(image?.username ? `${image.username}` : 'username')[0]).toUpperCase()}</p></div>
                  <div className={styles.user_name}><p className={`${styles.user_name} ${styles.text}`}>{image.username}</p></div>
                </div>
                <div className={styles.box}>
                  <div className={styles.user_img}><img src={like} alt='u' className={`${styles.user} ${styles.upload}`}/></div>
                  <div className={styles.user_name}><p className={`${styles.user_name} ${styles.text}`}>{image.img_likes}</p></div>
                </div>
              </div>
              <div className={styles.top_details}>
                  <p className={styles.description}>{image.des}</p>
              </div>
              <div className={styles.bottom_details}>
                  <button className={styles.btn} onClick={()=>handleSave}><img src={save} alt='save' className={styles.img}/><p className={styles.txt}> Save Image</p></button>
                  <br/>
                  <button className={styles.btn} onClick={()=>handleDownload(image.img_url, image.img_name)}><img src={download} alt='download' className={styles.img}/><p className={styles.txt}> Download</p></button>
                  <br/>
                  <button className={styles.btn} onClick={()=>handleLike}><img src={like} alt='like' className={styles.img}/><p className={styles.txt}> Like</p></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageDetails
