import { userSate, useEffect } from "react"
import { ref, upladBytes, getDownloadURL } from "firebase/storage"
import { storage } from "../firebase"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { Container, Image, Form, Button } from "react-bootstrap"
import AppNavBar from "../components/NavBar"

const API = "https://restaurant-backend-production-3168.up.railway.app"

export default function ProfilePage() {
    const [profilePic, setProfilePic] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const token = localStorage.getItem('token')
    const decoded = token ? jwtDecode(token) : null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API}/users/${decoded.id}`, { headers: { Authorization: `Bearer ${token}` } })
                setPreviewUrl(res.data.profile_pic || '')
            } catch (err) {
                console.error(err)
            }
        }
        if (decoded) fetchUser()
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setProfilePic(e.target.files[0])
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!profilePic) return;
        setLoading(true)
        setError('')
        setSuccess('');

        try {
            const storageRef = ref(storage, `profiles/${decoded.id}_${Date.now()}`)
            await uploadBytes(storageRef, profilePic)
            const url = await getDownloadURL(storageRef)
            await axios.put(`${API}/users/${decoded.id}`,
                { profile_pic: url },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            setPreviewUrl(url)
            setSuccess('Profile picture updated successfully!')
            setTimeout(() => setSuccess(''), 3000)

        } catch (err) {
            console.error(err)
            setError(`Upload failed. Please try again.`)
            setTimeout(() => setError(''), 3000)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div style={{ backgroundColor: "#f8f4f0", minHeight: "100vh" }}>
            <AppNavBar />
            <Container className="my-5" style={{ maxWidth: "500px" }}>
                <h2 className="text-center mb-4">Profile</h2>

                <div className="text-center mb-4">
                    {previewUrl ? (<Image
                        src={previewUrl}
                        roundedCircle
                        style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />)
                        : (
                            <div
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    borderRadius: "50%",
                                    backgroundColor: "#ddd",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto"
                                }}
                            >
                                <span>No Photo</span>
                            </div>
                        )}
                </div>

                <div className="text-center mb-4">
                    <h5>{decoded?.email}</h5>
                    <p className="text-muted">
                        {decoded?.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </p>
                </div>

                {success && <p style={{ color: "green", textAlign: "center" }}>{success}</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <Form onSubmit={handleUpload}>
                    <Form.Group className="mb-3">
                        <Form.Label>Update Profile Picture</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="danger"
                            className="rounded-pill"
                            disabled={loading || !profilePic}
                        >
                            {loading ? "Uploading..." : "Upload Photo"}
                        </Button>
                    </div>
                </Form>

            </Container>
        </div>
    )
}
