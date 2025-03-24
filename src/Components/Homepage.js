import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import design from '../CSS/Homepage.module.css';
import search from '../assets/loupe.png';
import Imagegrid from './Imagegrid';
import Footer from './Footer';
import Loader from '../Components/Loader';

function Homepage() {
    const [searchText, setSearchText] =useState("");
    const [filteredImages, setFilteredImages] = useState([]);
    const [defaultImages, setDefaultImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      fetchImages();
    }, []);

    const fetchImages=async()=>{
      setIsLoading(true);
        const response= await fetch("http://localhost:8080/api/images/getRandomImages",{
          method: "POST",
          headers: {"Content-Type": "application/json"},
        });
    
        if(response.ok)
        {
          const data= await response.json();
          setDefaultImages(data);
        }
        else{
          console.log("there is an error");
        }
        setIsLoading(false);
      }

    const handleSearch=async(e) => {
      setIsLoading(true);
      e.preventDefault();
        if (searchText.trim()) {
            const response = await fetch(`http://localhost:8080/api/images/searchBy/${searchText}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredImages(data);
            }
            else{
              console.log("error");
            }
        }
        setIsLoading(false);
    };

    if (isLoading) {
      return <Loader/>;
    }

  return (
    <div className={design.container}>
      <div className={design.nav}> 
        <Navbar/>
      </div>
      <div className={design.circle}></div>
      <div className={design.top_circle}></div>
      <p className={design.heading}>Discover photographs and designs</p>
      <div className={design.search_bar}>
        <input type='search' placeholder='Search here...' className={design.search} value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
        <button type='button' onClick={handleSearch} className={design.btn}><img src={search} alt='search' className={design.search_btn}/></button>
      </div>
      <div className={design.homepageContainer}> 
        <Imagegrid images={filteredImages.length > 0 ? filteredImages : defaultImages}/>
        <Footer/>
      </div>
    </div>
  )
}

export default Homepage
