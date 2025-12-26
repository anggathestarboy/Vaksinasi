import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Vacination = () => {
    const [spot, setSpot] = useState([]);
    let token = localStorage.getItem("token");

    const navigate = useNavigate();


    const [vaccination, setVaccination] = useState(null);


    const goToDetail = (id) => {
  navigate(`/vaccination/${id}`);
};


    const getVaccination = async () => {
  const res = await axios.get(
    "http://localhost:8000/api/v1/vaccinations?token=" + token
  );
  setVaccination(res.data.vaccinations);
};

const isSpotDisabled = (serve) => {

  if (!vaccination) {
   
    if (serve === 2) return true;
    return false;
  }

  const firstDone = vaccination.first?.status === "done";
  const secondDone = vaccination.second?.status === "done";


  if (firstDone && secondDone) return true;


  if (firstDone && serve === 1) return true;


  if (!firstDone && serve === 2) return true;

  return false;
};



    const getSpot = async() => {
        const res = await axios.get("http://localhost:8000/api/v1/spots?token=" + token);
        setSpot(res.data.spots)
    }

    useEffect(() => {
        getSpot();
         getVaccination();
    }, []);


    console.log(spot)


    const serveText = (serve) => {
  if (serve === 1) return "Only first vaccination";
  if (serve === 2) return "Only second vaccination";
  if (serve === 3) return "Both";
  return "-";
};


  return (
    <div>
      
<Navbar/>

<main>
    {/* <!-- S: Header --> */}
    <header class="jumbotron">
        <div class="container">
            <h1 class="display-4">First Vaccination</h1>
        </div>
    </header>
    {/* <!-- E: Header --> */}

    <div class="container mb-5">

        <div class="section-header mb-4">
            <h4 class="section-title text-muted font-weight-normal">List Vaccination Spots in Central Jakarta</h4>
        </div>

        <div class="section-body">


            {
                spot.map((s) => (
                    <>
                    
            <article
  className={`spot ${isSpotDisabled(s.serve) ? "disabled" : ""}`}
  style={{
    pointerEvents: isSpotDisabled(s.serve) ? "none" : "auto",
    opacity: isSpotDisabled(s.serve) ? 0.5 : 1,
    cursor: "pointer"
  }}
  onClick={() => goToDetail(s.id)}
>

                <div class="row">
                    <div class="col-5">
                        <h5 class="text-primary">{s.name}</h5>
                        <span class="text-muted">{s.address}</span>
                    </div>
                    <div class="col-4">
                        <h5>Available vaccines</h5>
                        <span class="text-muted">{s.vaccine.Sinovac && 'Sinovac '}
{s.vaccine.AstraZeneca && 'AstraZeneca '}
{s.vaccine.Moderna && 'Moderna '}
{s.vaccine.Pfizer && 'Pfizer '}
{s.vaccine.Sinnopharm && 'Sinnopharm '}
</span>
                    </div>
                    <div class="col-3">
                        <h5>Serve</h5>
                       <span className="text-muted">
  {serveText(s.serve)}
</span>

                    </div>
                </div>
            </article>
                    </>
                ))
            }


     

        </div>

    </div>

</main>

{/* <!-- S: Footer --> */}
<footer>
    <div class="container">
        <div class="text-center py-4 text-muted">
            Copyright &copy; 2021 - Web Tech ID
        </div>
    </div>
</footer>
{/* <!-- E: Footer --> */}
    </div>
  )
}

export default Vacination
