import { useState, useEffect } from "react";
import { Container, Row, Button } from "react-bootstrap";
import axios from "axios"
import AppNavBar from "../components/NavBar";
import RestaurantCard from "../components/RestaurantCard";
import Footer from "../components/Footer";
import { SiLeaderprice } from "react-icons/si";

const API = 'https://restaurant-backend-production-3168.up.railway.app'

export default function RestaurantPage() {
    const [restaurants, setRestaurants] = useState([])
    const [search, setSearch] = useState('')
    const [cuisineFilter, setCuisineFilter] = useState('All')
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [ratingFilter, setRatingFilter] = useState('All')
    const [capacityFilter, setCapacityFilter] = useState('All')
    const [priceFilter, setPriceFilter] = useState('All')

    useEffect(() => {
        fetchRestaurants()
    }, [])



    const fetchRestaurants = async () => {
        try {
            const res = await axios.get(`${API}/restaurants`)
            setRestaurants(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const cuisines = ['All', ...new Set(restaurants.map(r => r.cuisine_type))]


    const filtered = restaurants.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase())
        const matchCuisine = cuisineFilter === 'All' || r.cuisine_type === cuisineFilter
        const matchRating = ratingFilter === 'All' || (r.avg_rating && parseFloat(r.avg_rating) >= parseFloat(ratingFilter))
        const matchCapacity = capacityFilter === 'All' || r.capacity >= parseInt(capacityFilter)
        const matchPrice = priceFilter === 'All' || restaurant.price_range === priceFilter
        return matchSearch && matchCuisine && matchRating && matchCapacity && matchPrice
    })

    return (
        <div style={{ backgroundColor: "#f8f4f0", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppNavBar />
            <Container className="my-5" style={{ flex: 1 }}>
                <div className="d-flex flex-wrap gap-2 mb-4">
                    <input
                        type="text"
                        className='form-control'
                        style={{ maxWidth: "300px" }}
                        placeholder="Search restaurants..."
                        value={search}
                        onChange={(e) => setCuisineFilter(e.target.value)}
                    />
                    <select
                        className="form-select"
                        style={{ maxWidth: "180px" }}
                        value={cuisineFilter}
                        onChange={(e) => setCuisineFilter(e.target.value)}
                    >
                        {cuisines.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        className="form-select"
                        style={{ maxWidth: "180px" }}
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                    >
                        <option value="All">All Ratings</option>
                        <option value="3">3⭐ & above</option>
                        <option value="4">4⭐ & above</option>
                        <option value="4.5">4.5⭐ & above</option>
                    </select>
                    <select
                        className="form-select"
                        style={{ maxWidth: "180px" }}
                        value={capacityFilter}
                        onChange={(e) => setCapacityFilter(e.target.value)}
                    >
                        <option value="All">Any Price</option>
                        <option value="$">$ — Under RM50</option>
                        <option value="$$">$$ — RM50 to RM150</option>
                        <option value="$$$">$$$ — Above RM150</option>
                    </select>



                    <Button
                        variant="outline-danger"
                        size='sm'
                        onClick={() => {
                            setSearch('')
                            setCuisineFilter('All')
                            setRatingFilter('All')
                            setCapacityFilter('All')
                            setPriceFilter('All')
                        }}
                    >
                        Clear Filter
                    </Button>
                </div>



                <Row>
                    {filtered.map(restaurant => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onSelect={setSelectedRestaurant}
                        />
                    ))}
                </Row>
            </Container>
            <Footer />
        </div>
    )
}