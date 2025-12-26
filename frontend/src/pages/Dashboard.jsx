import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Vacination from "./Vacination";

const Dashboard = () => {
    const [konsultasi, setKonsultasi] = useState([]);
    let token = localStorage.getItem("token");

    const [vaccination, setVaccinations] = useState([]);

const getVaccinations = async () => {
  const res = await axios.get(
    "http://localhost:8000/api/v1/vaccinations?token=" + token
  );
  setVaccinations(res.data.vaccinations);
};

const getStatusBadgeClass = (status) => {
  if (status === "accepted") return "badge badge-primary"
  if (status === "pending") return "badge badge-warning"
  if (status === "declined") return "badge badge-danger"
  return "badge badge-secondary"
}


    const getKonsultasi = async () => {
        const res = await axios.get(
            "http://localhost:8000/api/v1/consultations?token=" + token
        );
        setKonsultasi(res.data);
    };

    useEffect(() => {
        getKonsultasi();
        getVaccinations();
    }, []);


    const hasAcceptedConsultation = konsultasi.some(
  (k) => k.status === "accepted"
)

    // console.log(first);

    return (
        <div>
            <Navbar />

            <main>
                {/* <!-- S: Header --> */}
                <header class="jumbotron">
                    <div class="container">
                        <h1 class="display-4">Dashboard</h1>
                    </div>
                </header>
                {/* <!-- E: Header --> */}

                <div class="container">
                    {/* <!-- S: Consultation Section --> */}
                    <section class="consultation-section mb-5">
                        <div class="section-header mb-3">
                            <h4 class="section-title text-muted">
                                My Consultation
                            </h4>
                        </div>
                        <div class="row">
                            {/* <!-- S: Link to Request Consultation --> */}

                            <div class="col-md-4">
                                <div class="card card-default">
                                    <div class="card-header">
                                        <h5 class="mb-0">Consultation</h5>
                                    </div>
                                    <div class="card-body">
                                        <a href="/consultation">
                                            + Request consultation
                                        </a>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- E: Link to Request Consultation --> */}

                            {/* <!-- E: Society Consultation Box (Pending) --> */}

                            {/* <!-- S: Society Consultation Box (Accepted) --> */}

                            {konsultasi.map((k) => (
                                <>
                                    <div class="col-md-4">
                                        <div class="card card-default">
                                            <div class="card-header border-0">
                                                <h5 class="mb-0">
                                                    Consultation
                                                </h5>
                                            </div>
                                            <div class="card-body p-0">
                                                <table class="table table-striped mb-0">
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>
                                                      <span className={getStatusBadgeClass(k.status)}>
  {k.status}
</span>

                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Disease History</th>
                                                        <td class="text-muted">
                                                            {k.disease_history ||
                                                                "-"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>
                                                            Current Symptoms
                                                        </th>
                                                        <td class="text-muted">
                                                            {k.current_symptoms}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Doctor Name</th>
                                                        <td class="text-muted">
                                                            {k?.doctor?.name ||
                                                                "belum divalidasi"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>Doctor Notes</th>
                                                        <td class="text-muted">
                                                            {k.doctor_notes ||
                                                                "-"}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))}

                          
                        </div>
                    </section>
                  
             <section className="consultation-section mb-5">
  <div className="section-header mb-3">
    <h4 className="section-title text-muted">My Vaccinations</h4>
  </div>

  <div className="section-body">

    {!hasAcceptedConsultation && (
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-warning">
            Your consultation must be approved by doctor to get the vaccine.
          </div>
        </div>
      </div>
    )}

    {hasAcceptedConsultation && (
      <>
        <div className="row mb-4">

          {/* FIRST VACCINATION */}
          {!vaccination?.first && (
            <div className="col-md-4">
              <div className="card card-default">
                <div className="card-header border-0">
                  <h5 className="mb-0">First Vaccination</h5>
                </div>
                <div className="card-body">
                  <a href="/vaccination">
                    + Register vaccination
                  </a>
                </div>
              </div>
            </div>
          )}

          {vaccination?.first && (
            <div className="col-md-4">
              <div className="card card-default">
                <div className="card-header border-0">
                  <h5 className="mb-0">First Vaccination</h5>
                </div>
                <div className="card-body p-0">
                  <table className="table table-striped mb-0">
                    <tbody>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className="badge badge-primary">
                            {vaccination.first.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{vaccination.first.vaccination_date}</td>
                      </tr>
                      <tr>
                        <th>Spot</th>
                        <td>{vaccination.first.spot.name}</td>
                      </tr>
                      <tr>
                        <th>Vaccine</th>
                        <td>{vaccination.first.vaccine.name}</td>
                      </tr>
                      <tr>
                        <th>Vaccinator</th>
                        <td>{vaccination.first.vaccinator.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        <div className="row">

          {/* SECOND VACCINATION */}
          {vaccination?.first && !vaccination?.second && (
            <div className="col-md-4">
              <div className="card card-default">
                <div className="card-header border-0">
                  <h5 className="mb-0">Second Vaccination</h5>
                </div>
                <div className="card-body">
                  <a href="/vaccination">
                    + Register vaccination
                  </a>
                </div>
              </div>
            </div>
          )}

          {vaccination?.second && (
            <div className="col-md-4">
              <div className="card card-default">
                <div className="card-header border-0">
                  <h5 className="mb-0">Second Vaccination</h5>
                </div>
                <div className="card-body p-0">
                  <table className="table table-striped mb-0">
                    <tbody>
                      <tr>
                        <th>Status</th>
                        <td>
                          <span className="badge badge-info">
                            {vaccination.second.status}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <th>Date</th>
                        <td>{vaccination.second.vaccination_date}</td>
                      </tr>
                      <tr>
                        <th>Spot</th>
                        <td>{vaccination.second.spot.name}</td>
                      </tr>
                      <tr>
                        <th>Vaccine</th>
                        <td>{vaccination.second.vaccine.name}</td>
                      </tr>
                      <tr>
                        <th>Vaccinator</th>
                        <td>{vaccination.second.vaccinator.name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </>
    )}
  </div>
</section>

                    {/* <!-- E: List Vaccination Section --> */}
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
    );
};

export default Dashboard;
