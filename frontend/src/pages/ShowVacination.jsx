import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const ShowVacination = () => {
  const { spotId } = useParams()
  const token = localStorage.getItem("token")
  const navigate = useNavigate();

  const [spot, setSpot] = useState()
  const [date, setDate] = useState("")
  const [loading, setLoading] = useState(false)


  const getSpotDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/spots/${spotId}?token=${token}`
      )
      setSpot(res.data.spot)
    } catch (err) {
      alert("Failed load spot detail")
    }
  }

  const registerVaccination = async () => {
    if (!date) {
      alert("Please select vaccination date")
      return
    }

    try {
      setLoading(true)

      const res = await axios.post(
        `http://localhost:8000/api/v1/vaccinations?token=${token}`,
        {
          spot_id: spotId,
          date: date
        }
      )

      navigate('/dashboard')

    } catch (err) {
      alert(err.response?.data?.message || "Register failed")
    } finally {
      setLoading(false)
    }
  }

const slotsPerSession = spot ? Math.floor(spot.capacity / 3) : 0


  useEffect(() => {
    getSpotDetail()
  }, [])

  return (
    <div>
      <Navbar />

      <main>
        {/* HEADER */}
        <header className="jumbotron">
          <div className="container d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-4">{spot?.name}</h1>
              <span className="text-muted">{spot?.address}</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={registerVaccination}
              disabled={loading}
            >
              {loading ? "Processing..." : "Register vaccination"}
            </button>
          </div>
        </header>

        <div className="container">

          {/* DATE */}
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="form-group">
                <label>Select vaccination date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SESSION (VISUAL ONLY) */}
         <div className="row mb-5">
  {[
    "09:00 - 11:00",
    "13:00 - 15:00",
    "15:00 - 17:00"
  ].map((time, index) => (
    <div className="col-md-4" key={index}>
      <div className="card card-default">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h4>Session {index + 1}</h4>
            <span className="text-muted">{time}</span>
          </div>

      <div className="row">
  {Array.from({ length: slotsPerSession }).map((_, i) => {
    const queueNumber = index * slotsPerSession + i + 1

    return (
      <div className="col-4 mb-3" key={queueNumber}>
        <div className="slot bg-primary text-white">
          #{queueNumber}
        </div>
      </div>
    )
  })}
</div>


        </div>
      </div>
    </div>
  ))}
</div>

        </div>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="text-center py-4 text-muted">
            Copyright &copy; 2021 - Web Tech ID
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ShowVacination
