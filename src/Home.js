import React from 'react'
import { Routes, Route, Link } from "react-router-dom";
import App from './App';
import PostImage from './PostImage';
const Home = () => {
    return (
        <>
           <Routes>
               <Route path='/' element={<App/>}/>
               <Route path='/postImage' element={<PostImage/>}/>
               <Route path='/home' element={<App/>}/>
                
           </Routes> 
        </>
    )
}

export default Home
