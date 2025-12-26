import axios from 'axios';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const nama = localStorage.getItem("name");
    let token = localStorage.getItem("token");
const navigate = useNavigate();


    const handleLogout = async() => {
        await axios.post(`http://127.0.0.1:8000/api/v1/auth/logout?token=${token}`);
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        navigate('/')
    }


  return (
    <div>
                  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
    <div class="container">
        <a class="navbar-brand" href="#">Vaccination Platform</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="#">{nama}</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#"><button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} onClick={() => handleLogout()}>Logout</button></a>
                </li>
            </ul>
        </div>
    </div>
</nav>
    </div>
  )
}

export default Navbar
