import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateConsultation = () => {
    let token = localStorage.getItem("token");
    const [diseaseAnswer, setDiseaseAnswer] = useState("")

    const [answer, setAnswer] = useState({
  disease: "yes",
  symptoms: "yes"
})


const handleAnswerChange = (field, value) => {
  setAnswer({
    ...answer,
    [field]: value
  })

  if (value === "no") {
    setForm({
      ...form,
      [field === "disease" ? "disease_history" : "current_symptoms"]: ""
    })
  }
}

    const [form, setForm] = useState({
        disease_history: "",
        current_symptoms: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        await axios.post("http://localhost:8000/api/v1/consultations?token=" + token, form);
        navigate("/dashboard")
    }


  return (
    <div>
      
<Navbar/>

<main>
    {/* <!-- S: Header --> */}
    <header class="jumbotron">
        <div class="container">
            <h1 class="display-4">Request Consultation</h1>
        </div>
    </header>
    {/* <!-- E: Header --> */}

    <div class="container">

        <form onSubmit={handleSubmit}>
            <div class="row mb-4">
                <div class="col-md-6">
                <div className="form-group">
  <div className="d-flex align-items-center mb-3">
    <label className="mr-3 mb-0">Do you have disease history ?</label>
    <select
      className="form-control-sm"
      value={answer.disease}
      onChange={(e) => handleAnswerChange("disease", e.target.value)}
    >
      <option value="yes">Yes, I have</option>
      <option value="no">No</option>
    </select>
  </div>

  <textarea
    className="form-control"
    name="disease_history"
    value={form.disease_history}
    onChange={handleChange}
    disabled={answer.disease === "no"}
    cols="30"
    rows="10"
    placeholder="Describe your disease history"
  />
</div>

                </div>
            </div>

            <div class="row mb-4">
                <div class="col-md-6">
                  <div className="form-group">
  <div className="d-flex align-items-center mb-3">
    <label className="mr-3 mb-0">Do you have symptoms now ?</label>
    <select
      className="form-control-sm"
      value={answer.symptoms}
      onChange={(e) => handleAnswerChange("symptoms", e.target.value)}
    >
      <option value="yes">Yes, I have</option>
      <option value="no">No</option>
    </select>
  </div>

  <textarea
    className="form-control"
    name="current_symptoms"
    value={form.current_symptoms}
    onChange={handleChange}
    disabled={answer.symptoms === "no"}
    cols="30"
    rows="10"
    placeholder="Describe your current symptoms"
  />
</div>

                </div>
            </div>

            <button class="btn btn-primary" type='submit'>Send Request</button>
        </form>

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

export default CreateConsultation
