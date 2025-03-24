import React, { useEffect, useState } from 'react';
import design from '../CSS/Explore.module.css';
import Navbar from '../Components/Navbar';
import search from '../assets/loupe.png';
import Imagegrid from './Imagegrid';
import Footer from './Footer';
import Loader from '../Components/Loader';

function Explore() {
    const [searchText, setSearchText] =useState("");
    const [filteredImages, setFilteredImages] = useState([]);  // Store search results or null
    const [defaultImages, setDefaultImages] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchImages();  // Fetch default images when the component mounts
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

    const handleSearch =async(e) => {
        setIsLoading(true);
        e.preventDefault();
        if (searchText.trim()) {
            const response = await fetch(`http://localhost:8080/api/images/searchBy/${searchText}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredImages(data);
            }
        }
        setIsLoading(false);
    };

    const handleFilter=async(filter)=>{
        setIsLoading(true);
        setFilteredImages([]);
        const response = await fetch("http://localhost:8080/api/images/getFilterImages",{
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({filter})
        });

        if(response.ok)
        {
            const data = await response.json();
            setFilteredImages(data)
            console.log(data);
        }
        else{
            console.log("error");
            setFilteredImages([]);
        }
        setIsLoading(false);
    }

    if (isLoading) {
        return <Loader/>; // Display loader while loading
      }

  return (
    <div className={design.main_container}>
        <div className={design.nav}> 
            <Navbar/>
        </div>
        <div className={design.circle}></div>
        <div className={design.top_circle}></div>
        <div className={design.content}>
        <div className={design.search_bar}>
            <input type='search' placeholder='Search here...' className={design.search} value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
            <button type='button' onClick={handleSearch} className={design.btn}><img src={search} alt='search' className={design.search_btn}/></button>
        </div>
        <div className={design.filters}>
            <button className={design.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)}>&#9776;</button>
            <ul className={`${design.filter_list} ${isMenuOpen? design.filter_menu:''}`}>
                <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Nature")}}>Nature</button></li>
                <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Photograph")}}>Photos</button></li>
                <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Illustration")}}>Illustrations</button></li>
                <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Product Shoot")}}>Product Shoot</button></li>
                <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Jwellery")}}>Jwellery</button></li>
                {/* <li className={design.item}><button className={design.filter} onClick={()=>{handleFilter("Most")}}>Most Liked</button></li> */}
            </ul>
        </div>
        </div>
        <div className={design.homepageContainer}> 
            <Imagegrid images={filteredImages.length > 0 ? filteredImages : defaultImages}/>
            <Footer/>
      </div>
    </div>
  )
}

export default Explore
