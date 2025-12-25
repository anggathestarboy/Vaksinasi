import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const MyProfile = () => {
  const token = localStorage.getItem('token')
  const name = localStorage.getItem('name') // username

  const [profile, setProfile] = useState({})
  const [follower, setFollower] = useState([])
  const [following, setFollowing] = useState([])
  const [currentSlide, setCurrentSlide] = useState({})
  const [loading, setLoading] = useState(true)

  const getFollower = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/users/${name}/followers`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFollower(res.data.follower || [])
    } catch (err) {
      console.error('Error fetching followers:', err)
      setFollower([])
    }
  }

  const getFollowing = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/users/${name}/following`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setFollowing(res.data.following || [])
    } catch (err) {
      console.error('Error fetching following:', err)
      setFollowing([])
    }
  }

  const getMyProfile = async () => {
    setLoading(true)
    await Promise.all([getFollower(), getFollowing()]) // paralel

    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/users/${name}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const userData = res.data.user
      setProfile({
        ...userData,
        follower_count: res.data.follower_count || 0,
        following_count: res.data.following_count || 0
      })

      // Inisialisasi slider untuk post yang punya gambar
      const initialSlides = {}
      userData.posts?.forEach(post => {
        if (post.attachments?.length > 0) {
          initialSlides[post.id] = 0
        }
      })
      setCurrentSlide(initialSlides)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getMyProfile()
  }, [])

  const nextSlide = (postId, totalSlides) => {
    setCurrentSlide(prev => ({
      ...prev,
      [postId]: (prev[postId] + 1) % totalSlides
    }))
  }

  const prevSlide = (postId, totalSlides) => {
    setCurrentSlide(prev => ({
      ...prev,
      [postId]: (prev[postId] - 1 + totalSlides) % totalSlides
    }))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return diffInHours <= 1 ? '1 hour ago' : `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return diffInDays <= 1 ? '1 day ago' : `${diffInDays} days ago`
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container py-5 mt-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />

      <main className="mt-5">
        <div className="container py-5">
          {/* Profile Header */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-10">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-3">
                        <div>
                          <h4 className="mb-0 me-3">{profile.full_name}</h4>
                          <span className="text-muted">@{profile.username}</span>
                        </div>
                        <Link
                          to="/post/create"
                          className="btn btn-primary d-flex align-items-center gap-2 ms-auto"
                        >
                          <Plus size={20} />
                          Create new post
                        </Link>
                      </div>

                      <p className="mb-4">{profile.bio || 'No bio available'}</p>

                      <div className="d-flex gap-5">
                        {/* Posts */}
                        <div className="text-center">
                          <div className="fs-4 fw-bold">{profile.posts_count || 0}</div>
                          <div className="text-muted">Posts</div>
                        </div>

                        {/* Followers - dengan dropdown */}
                        <div className="text-center position-relative profile-dropdown-container">
                          <div className="profile-label fs-4 fw-bold cursor-pointer">
                            {profile.follower_count || 0}
                          </div>
                          <div className="text-muted">Followers</div>

                          <div className="profile-list">
                            <div className="card shadow">
                              <div className="card-body p-3">
                                {follower.length === 0 ? (
                                  <p className="text-muted mb-0 small">No followers yet</p>
                                ) : (
                                  follower.map((f) => (
                                    <div key={f.id} className="profile-user py-1">
                                      <Link
                                        to={`/userprofile/${f.username}`}
                                        className="text-decoration-none text-dark"
                                      >
                                        @{f.username}
                                      </Link>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Following - dengan dropdown */}
                        <div className="text-center position-relative profile-dropdown-container">
                          <div className="profile-label fs-4 fw-bold cursor-pointer">
                            {profile.following_count || 0}
                          </div>
                          <div className="text-muted">Following</div>

                          <div className="profile-list">
                            <div className="card shadow">
                              <div className="card-body p-3">
                                {following.length === 0 ? (
                                  <p className="text-muted mb-0 small">Not following anyone</p>
                                ) : (
                                  following.map((follow) => (
                                    <div key={follow.id} className="profile-user py-1">
                                      <Link
                                        to={`/userprofile/${follow.username}`}
                                        className="text-decoration-none text-dark"
                                      >
                                        @{follow.username}
                                      </Link>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          {profile.posts?.length === 0 ? (
            <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center py-5">
                    <div className="mb-4">
                      <Plus size={48} className="text-muted" />
                    </div>
                    <h5 className="mb-2">No posts yet</h5>
                    <p className="text-muted mb-4">Share your first moment with the world!</p>
                    <Link to="/post/create" className="btn btn-primary">
                      Create your first post
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {profile.posts?.map((post) => (
                <div className="col-md-4" key={post.id}>
                  <div className="card shadow-sm h-100 border-0">
                    <div className="card-header bg-white border-0 d-flex align-items-center justify-content-between py-3">
                      <div>
                        <h6 className="mb-0">{profile.full_name}</h6>
                        <small className="text-muted">@{profile.username}</small>
                      </div>
                      <small className="text-muted">{formatDate(post.created_at)}</small>
                    </div>

                    {post.attachments?.length > 0 && (
                      <div
                        className="position-relative overflow-hidden"
                        style={{
                          backgroundColor: '#f8f9fa',
                          height: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div className="w-100 h-100 position-relative">
                          {post.attachments.map((attachment, index) => (
                            <div
                              key={attachment.id}
                              className="position-absolute top-0 start-0 w-100 h-100"
                              style={{
                                opacity: index === (currentSlide[post.id] ?? 0) ? 1 : 0,
                                transition: 'opacity 0.4s ease'
                              }}
                            >
                              <img
                                src={`http://127.0.0.1:8000/storage/${attachment.storage_path}`}
                                alt={`Post ${index + 1}`}
                                className="w-100 h-100"
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                          ))}
                        </div>

                        {post.attachments.length > 1 && (
                          <>
                            <button
                              className="position-absolute top-50 start-0 translate-middle-y btn btn-sm btn-light rounded-circle shadow-sm ms-2"
                              onClick={() => prevSlide(post.id, post.attachments.length)}
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              className="position-absolute top-50 end-0 translate-middle-y btn btn-sm btn-light rounded-circle shadow-sm me-2"
                              onClick={() => nextSlide(post.id, post.attachments.length)}
                            >
                              <ChevronRight size={20} />
                            </button>

                            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
                              {post.attachments.map((_, index) => (
                                <div
                                  key={index}
                                  className={`rounded-circle ${
                                    index === (currentSlide[post.id] ?? 0)
                                      ? 'bg-white'
                                      : 'bg-white opacity-50'
                                  }`}
                                  style={{ width: '8px', height: '8px' }}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <div className="card-body">
                      <p className="mb-0">
                        <b>@{profile.username}</b> {post.caption || ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CSS untuk hover dropdown */}
      <style jsx>{`
        .profile-dropdown-container:hover .profile-list {
          display: block;
        }
        .profile-list {
          display: none;
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: 200px;
          margin-top: 8px;
        }
        .profile-label {
          cursor: default;
        }
        .profile-user:hover {
          background-color: #f8f9fa;
          border-radius: 4px;
          padding-left: 4px;
          padding-right: 4px;
          margin-left: -4px;
          margin-right: -4px;
        }
      `}</style>
    </div>
  )
}

export default MyProfile