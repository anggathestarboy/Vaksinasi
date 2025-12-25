import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

const UserProfile = () => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [followLoading, setFollowLoading] = useState(false)

  const token = localStorage.getItem('token')
  const currentUsername = localStorage.getItem('name')

  // Fungsi untuk refresh profile dari API
  const fetchProfile = async () => {
    if (!token) {
      setError('Silakan login terlebih dahulu')
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const profileRes = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProfile(profileRes.data)

      const [followersRes, followingRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/v1/users/${username}/followers`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { follower: [] } })),

        axios.get(`http://127.0.0.1:8000/api/v1/users/${username}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        }).catch(() => ({ data: { following: [] } })),
      ])

      setFollowers(followersRes.data.follower || [])
      setFollowing(followingRes.data.following || [])
    } catch (err) {
      if (err.response?.status === 403 || err.response?.status === 404) {
        setProfile(err.response.data || null)
      } else {
        setError(err.response?.data?.message || 'Gagal memuat profil')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [username, token])

  // Fungsi untuk follow atau unfollow
  const handleFollowAction = async () => {
    if (followLoading || !token || username === currentUsername) return

    setFollowLoading(true)
    try {
      const followStatus = profile?.follow_status

      if (followStatus === 'sudah') {
        // Lakukan UNFOLLOW
        await axios.delete(
          `http://127.0.0.1:8000/api/v1/users/${username}/unfollow`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // Lakukan FOLLOW
        await axios.post(
          `http://127.0.0.1:8000/api/v1/users/${username}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      // Refresh data setelah aksi berhasil
      await fetchProfile()
    } catch (err) {
      console.error('Follow/Unfollow failed:', err)
      alert(err.response?.data?.message || 'Gagal mengubah status follow')
    } finally {
      setFollowLoading(false)
    }
  }

  // Komponen slider gambar (tetap sama)
  const PostImageSlider = ({ attachments }) => {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!attachments?.length) return null

    const prev = () => setCurrentIndex(i => (i === 0 ? attachments.length - 1 : i - 1))
    const next = () => setCurrentIndex(i => (i === attachments.length - 1 ? 0 : i + 1))

    return (
      <div className="position-relative mb-3">
        <img
          src={`http://127.0.0.1:8000/storage/${attachments[currentIndex].storage_path}`}
          alt="post"
          className="w-100 rounded"
          style={{ maxHeight: '500px', objectFit: 'cover' }}
        />

        {attachments.length > 1 && (
          <>
            <button
              onClick={prev}
              className="position-absolute top-50 start-0 translate-middle-y btn btn-light rounded-circle shadow-sm"
              style={{ left: '12px', width: '36px', height: '36px' }}
            >
              ←
            </button>
            <button
              onClick={next}
              className="position-absolute top-50 end-0 translate-middle-y btn btn-light rounded-circle shadow-sm"
              style={{ right: '12px', width: '36px', height: '36px' }}
            >
              →
            </button>
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2">
              {attachments.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-circle ${i === currentIndex ? 'bg-white' : 'bg-white opacity-50'}`}
                  style={{ width: '8px', height: '8px' }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
  if (error) return <p className="text-center text-danger mt-5">{error}</p>
  if (!profile) return <p className="text-center mt-5">Profil tidak ditemukan</p>

  // Normalisasi data
  const user = profile.user || profile
  const isPrivate = user.is_private === 1 || profile.is_private === true
  const isAccepted = profile.is_accepted ?? false
  const posts = isPrivate && !isAccepted ? [] : (profile.user?.posts || profile.posts || [])
  const canSeePosts = !isPrivate || isAccepted
  const isOwnProfile = username === currentUsername

  // Tentukan teks dan kelas tombol berdasarkan follow_status
  const followStatus = profile.follow_status || 'not_following'
  let buttonText = 'Follow'
  let buttonClass = 'btn-primary'

  if (followStatus === 'sudah') {
    buttonText = 'Following'
    buttonClass = 'btn-outline-secondary'
  } else if (followStatus === 'requested') {
    buttonText = 'Requested'
    buttonClass = 'btn-outline-secondary'
  } else if (followStatus === 'not_following') {
    buttonText = 'Follow'
    buttonClass = 'btn-primary'
  }

  return (
    <div>
      <Navbar />

      <main className="mt-5">
        <div className="container py-5">
          {/* Header Profil */}
          <div className="row justify-content-center mb-5">
            <div className="col-md-10">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-3 flex-wrap gap-3">
                        <h4 className="mb-0">{user.full_name || 'User'}</h4>
                        <span className="text-muted">@{user.username || username}</span>

                        {!isOwnProfile && (
                          <button
                            onClick={handleFollowAction}
                            disabled={followLoading}
                            className={`btn ${buttonClass} ms-auto px-4`}
                          >
                            {followLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Loading...
                              </>
                            ) : (
                              buttonText
                            )}
                          </button>
                        )}
                      </div>

                      <p className="mb-4">{user.bio || 'Belum ada bio'}</p>

                      <div className="d-flex gap-5 flex-wrap">
                        <StatItem label="Posts" value={profile.posts_count ?? user.posts_count ?? 0} />
                        <StatItem label="Followers" value={profile.follower_count ?? 0} dropdown={followers} />
                        <StatItem label="Following" value={profile.following_count ?? 0} dropdown={following} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div className="row g-4 justify-content-center">
            {!canSeePosts ? (
              <div className="col-12 text-center py-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-5">
                    <h5>🔒 Akun ini privat</h5>
                    <p className="text-muted">
                      Ikuti @{username} untuk melihat postingannya.
                    </p>
                  </div>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body py-5">
                    <h5 className="text-muted">Belum ada postingan</h5>
                  </div>
                </div>
              </div>
            ) : (
              posts.map(post => (
                <div key={post.id} className="col-md-4">
                  <div className="card shadow-sm h-100 border-0">
                    <div className="card-header bg-white border-0 py-3">
                      <h6 className="mb-0">{user.full_name}</h6>
                      <small className="text-muted">@{username} • {formatDate(post.created_at)}</small>
                    </div>
                    {post.attachments?.length > 0 && <PostImageSlider attachments={post.attachments} />}
                    <div className="card-body">
                      <p className="mb-0">
                        <strong>@{username}</strong> {post.caption || ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Dropdown CSS */}
      <style jsx>{`
        .profile-dropdown { position: relative; display: inline-block; cursor: pointer; }
        .profile-dropdown .dropdown-content {
          display: none; position: absolute; background: white; min-width: 200px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15); z-index: 1000; border-radius: 8px;
          top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px;
          max-height: 300px; overflow-y: auto;
        }
        .profile-dropdown:hover .dropdown-content { display: block; }
        .dropdown-item { padding: 10px 16px; display: block; color: #333; text-decoration: none; }
        .dropdown-item:hover { background: #f8f9fa; }
      `}</style>
    </div>
  )
}

const StatItem = ({ label, value, dropdown = [] }) => (
  <div className="text-center profile-dropdown">
    <div className="fs-4 fw-bold">{value}</div>
    <div className="text-muted small">{label}</div>
    {dropdown.length > 0 && (
      <div className="dropdown-content">
        {dropdown.map(u => (
          <Link key={u.id} to={`/userprofile/${u.username}`} className="dropdown-item">
            @{u.username} {u.full_name && `- ${u.full_name}`}
          </Link>
        ))}
      </div>
    )}
  </div>
)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMins = Math.floor((now - date) / 60000)
  if (diffMins < 1) return 'baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} jam lalu`
  return `${Math.floor(diffMins / 1440)} hari lalu`
}

export default UserProfile