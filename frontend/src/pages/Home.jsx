import React, { useEffect, useState, useCallback, useRef } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { Link } from 'react-router-dom'

const Home = () => {
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('name')

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [exploreUsers, setExploreUsers] = useState([])
  const [followRequests, setFollowRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(true)

  const observer = useRef()

  // Accept follow request
  const acceptFollowRequest = async (followerUsername) => {
    try {
      const original = [...followRequests]
      setFollowRequests(prev => prev.filter(r => r.username !== followerUsername))

      await axios.put(
        `http://127.0.0.1:8000/api/v1/users/${followerUsername}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      getFollowRequests() // refresh
    } catch (err) {
      alert('Gagal menerima request')
      setFollowRequests(original)
    }
  }

  // Ambil follow requests
  const getFollowRequests = async () => {
    if (!username || !token) return
    setLoadingRequests(true)
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/${username}/followers`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const followers = res.data.follower || []
      setFollowRequests(followers.filter(f => f.is_requested === true))
    } catch (err) {
      setFollowRequests([])
    } finally {
      setLoadingRequests(false)
    }
  }

  // Ambil explore users
  const getExploreUsers = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setExploreUsers(res.data || [])
    } catch (err) {
      setExploreUsers([])
    }
  }

  // Ambil posts
  const getPosts = useCallback(async (pageNum) => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/v1/posts?page=${pageNum}&size=${size}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const newPosts = res.data.posts || []
      if (newPosts.length < size) setHasMore(false)
      if (pageNum === 1) {
        setPosts(newPosts)
      } else {
        setPosts(prev => [...prev, ...newPosts])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }, [token, size, loading, hasMore])

  useEffect(() => {
    if (token && username) {
      getFollowRequests()
      getExploreUsers()
      getPosts(1)
    }
  }, [token, username, getPosts])

  const lastPostElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => {
          const next = prev + 1
          getPosts(next)
          return next
        })
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore, getPosts])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffInHours < 24) return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`
  }

  return (
    <div>
      <Navbar />

      <main className="mt-5">
        <div className="container py-5">
          <div className="row justify-content-between">
            {/* News Feed */}
            <div className="col-md-8">
              <h5 className="mb-3">News Feed</h5>

              {initialLoad ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <p className="text-muted mb-0">No posts yet</p>
                  </div>
                </div>
              ) : (
                posts.map((p, index) => {
                  const isLast = posts.length === index + 1
                  return (
                    <div
                      key={p.id}
                      ref={isLast ? lastPostElementRef : null}
                      className="card mb-4"
                    >
                      <div className="card-header d-flex align-items-center justify-content-between bg-transparent py-3">
                        <h6 className="mb-0">{p.user.full_name}</h6>
                        <small className="text-muted">{formatDate(p.created_at)}</small>
                      </div>

                      <div className="card-body">
                        {/* Gambar-gambar ditampilkan vertikal satu per satu */}
                        {p.attachments?.length > 0 && (
                          <div className="card-images mb-2">
                            {p.attachments.map((img) => (
                              <img
                                key={img.id}
                                src={`http://127.0.0.1:8000/storage/${img.storage_path}`}
                                alt="post"
                                className="w-100 mb-2 rounded"
                                style={{ objectFit: 'cover' }}
                              />
                            ))}
                          </div>
                        )}

                        <p className="mb-0 text-muted">
                          <b>
                            <Link to={`/userprofile/${p.user.username}`} className="text-decoration-none">
                              @{p.user.username}
                            </Link>
                          </b>{' '}
                          {p.caption}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}

              {loading && hasMore && (
                <div className="text-center py-4">
                  <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  <p className="text-muted mt-2">Loading more posts...</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-md-4">
              {/* Follow Requests */}
              <div className="request-follow mb-4">
                <h6 className="mb-3">
                  Follow Requests {loadingRequests ? '' : `(${followRequests.length})`}
                </h6>
                <div className="request-follow-list">
                  {loadingRequests ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm" role="status" />
                    </div>
                  ) : followRequests.length === 0 ? (
                    <div className="card mb-2">
                      <div className="card-body text-center py-3">
                        <p className="text-muted small mb-0">No pending follow requests</p>
                      </div>
                    </div>
                  ) : (
                    followRequests.map((req) => (
                      <div key={req.id} className="card mb-2">
                        <div className="card-body d-flex align-items-center justify-content-between p-2">
                          <Link
                            to={`/userprofile/${req.username}`}
                            className="text-decoration-none"
                          >
                            @{req.username}
                          </Link>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => acceptFollowRequest(req.username)}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Explore People */}
              <div className="explore-people">
                <h6 className="mb-3">Explore People</h6>
                <div className="explore-people-list">
                  {exploreUsers.length === 0 ? (
                    <p className="text-muted small">No users found</p>
                  ) : (
                    exploreUsers.map((u) => (
                      <div key={u.id} className="card mb-2">
                        <div className="card-body p-2">
                          <Link
                            to={`/userprofile/${u.username}`}
                            className="text-decoration-none"
                          >
                            @{u.username}
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home