import { Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './Components/Homepage';
import Login from './Components/Login';
import Registration from './Components/Registration';
import Footer from './Components/Footer';
import Profile from './Components/Profile';
import Upload from './Components/Upload';
import ProfileFilter from './Components/Profile_filter';
import Explore from './Components/Explore';
import About from './Components/About';
import ImageDetails from './Components/ImageDetails';
import PersonProfile from './Components/PersonProfile';
import ForgetPassword from './Components/ForgetPassword';

function App() {
  return (

    <div className="App">

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path="/footer" element={<Footer/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path='/forget_password' element={<Upload/>}/>
        <Route path='/filter' element={<ProfileFilter type='Photo'/>}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/details' element={<ImageDetails/>}/>
        <Route path='/personProfile' element={<PersonProfile/>}/>
        <Route path='/forgetPassword' element={<ForgetPassword/>}/>
      </Routes>
    </div>
  );
}

export default App;
