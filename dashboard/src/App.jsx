import React, { useContext, useEffect } from 'react'
import {BrowserRouter as Router, Routes,Route} from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Doctors from "./components/Doctors";
import Login from "./components/Login";
import Message from "./components/Message";
import AddNweDoctor from "./components/AddNewDoctor";
import AddNewAdmin from "./components/AddNewAdmin";
import SlideBar from './components/SlideBar';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Context} from "./main";
import "./App.css"
import axios from 'axios';

function App() {
  const {isAuthenticated,setIsAuthenticated,admin,setAdmin} = useContext(Context);
  useEffect(()=>{
    const fetchUser = async()=>{
      try {
        const response = await axios.get("http://localhost:4000/api/v1/user/admin/me",{withCredentials:true});
        setIsAuthenticated(true);
        setAdmin(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      }
    };
    fetchUser();
  },{isAuthenticated});
  return (
    <Router>
      <SlideBar/>
        <Routes>
            <Route path='/' element={<Dashboard/>}></Route>
            <Route path='/doctors' element={<Doctors/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/messages' element={<Message/>}></Route>
            <Route path='/doctor/addnew' element={<AddNweDoctor/>}></Route>
            <Route path='/admin/addnew' element={<AddNewAdmin/>}></Route>
        </Routes>
        <ToastContainer position="top-center" />
    </Router>
  )
}

export default App