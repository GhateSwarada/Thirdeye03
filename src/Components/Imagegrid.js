import React, { useEffect, useState } from "react";
import style from "../CSS/Imagegrid.module.css";
import download from '../assets/downloads.png';
import save from '../assets/bookmark.png';
import like from '../assets/heart.png';
import { useNavigate } from 'react-router-dom';

function Imagegrid({images}) {

  const navigate = useNavigate();

  const token=localStorage.getItem("token");

  const[userId, setUserId] = useState(null);

  useEffect(()=>{
    getUserId();
  },[]);


  const getUserId=async()=>{
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

  const handleLike=async(imageId)=>{
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

  const handleSave=async(imageId)=>{
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

  const handleDownload=async(imageUrl, imageName)=>{
    try {
      const response = await fetch(imageUrl); 
      const blob = await response.blob();
      
      // Create an object URL for the blob
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  // const handleClick=(iId)=>{
  //   navigate("/details", {
  //     state: { imageId: iId }
  //   });
  // }

  const getImageDetails=(image_id)=>{
    navigate("/details", {
      state: { imageId: image_id }
    });
  }

  return (
    <div className={style.container}>
      <div className={style.bento_grid}>
        {images.map((image, index) => (
          <div 
            className={`${style.bento_grid_item} ${style[image.image_layout]}`} 
            key={index}
          >
            <img src={image.image_url} alt={image.image_name} className={style.img}/>
            <div className={style.overlay} onClick={()=> getImageDetails(image.image_id)}>
              <p className={style.txt}>{image.des}</p>
              <p className={style.txt}>{image.likes}</p>
              <div className={style.box}>
                <span className={style.icon_div} onClick={() => handleDownload(image.image_url, image.image_name)}><img className={style.icon} src={download} alt="download"/></span>
                <span className={style.icon_div} onClick={() => handleSave(image.image_id)}><img className={style.icon} src={save} alt="save"/></span>
                <span className={style.icon_div} onClick={() => handleLike(image.image_id)}><img className={style.icon} src={like} alt="like"/></span>
              </div>
              <button className={style.details}  onClick={() => getImageDetails(image.image_id)} type="button">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Imagegrid;
