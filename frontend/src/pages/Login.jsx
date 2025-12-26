import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
 const [form, setForm] = useState({
    id_card_number : "",
    password: ""
 })

 const navigate = useNavigate();
 const [error, setError] = useState();




 const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
 }


 const handleSubmit = async(e) => {
    e.preventDefault();

    try {
          const res = await axios.post("http://127.0.0.1:8000/api/v1/auth/login", form);
localStorage.setItem("token", res.data.login_tokens);
localStorage.setItem("name", res.data.name);
navigate('/dashboard')
    } catch (error) {
        setError("Username atau password salah");
        console.log(error)
    }
  
 }


  return (
    <>
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-primary">
    <div class="container">
        <a class="navbar-brand" href="#">Vaccination Platform</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" href="/">Login</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<main>
    {/* <!-- S: Header --> */}
    <header class="jumbotron">
        <div class="container text-center">
            <h1 class="display-4">Vaccination Platform</h1>
        </div>
    </header>
    {/* <!-- E: Header --> */}

    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <form class="card card-default" onSubmit={handleSubmit}>
                    <div class="card-header">
                        <h4 class="mb-0">Login</h4>
                    </div>
                    <div class="card-body">
                        <div class="form-group row align-items-center">
                            <div class="col-4 text-right">ID Card Number</div>
                            <div class="col-8"><input type="number" name='id_card_number' onChange={handleChange} value={form.id_card_number} class="form-control" /></div>
                        </div>
                        <div class="form-group row align-items-center">
                            <div class="col-4 text-right">Password</div>
                            <div class="col-8"><input type="password" name='password' onChange={handleChange} value={form.password} class="form-control" /></div>
                        </div>
                        <div class="form-group row align-items-center mt-4">
                            <div class="col-4"></div>
                            <div class="col-8"><button class="btn btn-primary" type='submit'>Login</button></div>
                        </div>
                    </div>
                    { error && <p style={{ color: "red" , textAlign: "center"}}>{error}</p>}
                </form>
            </div>
        </div>
    </div>
</main>
    </>
  )
}

export default Login
