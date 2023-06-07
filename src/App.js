import './App.css';
import Header from './Components/Header';
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './Pages/Auth/Login';
import { useEffect, useState } from 'react';
import useAuth from './hooks/UseAuth';
import Register from './Pages/Auth/Register';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import Connects from './Pages/Connects/Connects';
import Profile from './Pages/Profile/Profile';
import loadingGif from './assets/loading.gif'
import Lottie from 'react-lottie';
import loadingJson from './assets/loadingJson.json'
import ViewProfile from './Pages/Profile/ViewProfile';
import Dashboard from './Pages/Dashboard/Dashboard';
import UserDash from './Pages/User/UserDash';
function App() {

  const {isLoggedIn, loading} = useAuth()
  // console.log("isLoggedIn: ", isLoggedIn)
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingJson,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  // if(loading === true){
  //   return (
      
  //   )
  // }

  return (
    <div className='relative min-h-screen flex flex-col'>
      <ReactNotifications />
      {loading && (
        <>
        <div className='absolute top-0 left-0 h-screen w-full bg-white/50 flex flex-col items-cener justify-center'>
        {/* <img src={loadingGif} alt="loading..." className=''/> */}
        <div className=''>
          <Lottie 
            options={defaultOptions}
              height={400}
              width={400}
            />
        </div>
      </div>
      </>
      )}
      {/* {isLoggedIn && <Header />} */}
      <div className='flex-grow flex flex-col'>
        {!isLoggedIn? (
          <Routes>
            <Route exact path="/"element={<Login />} />
            <Route exact path="login" element={<Login />} />
            <Route exact path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        ): (
          
            <UserDash />
         
        //   <Routes>
        //   <Route path="/" >
        //     <Route  path="details/:id" element={<Details />} />
        //     <Route  path="connects" element={<Connects />} />
        //     <Route  path="chat" element={<Chat />} />
        //     <Route  path="messages/:id" element={<Messages />} />
        //     <Route  path="profile" element={<ViewProfile />} />
        //     <Route  path="editprofile" element={<Profile />} />
        //     <Route index element={<Dashboard />} />
        //   </Route>
        // </Routes>
        )}
      </div>
    </div>
  );
}

export default App;
