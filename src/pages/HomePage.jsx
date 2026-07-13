import AppNavBar from "../components/NavBar"
import HeroSection from "../components/HeroSection"
import { Container, Row } from "react-bootstrap"
import { useEffect, useState } from "react"
import axios from "axios"
import RestaurantCard from "../components/RestaurantCard";
import RestaurantMap from "../components/RestaurantMap";


export default function HomePage() {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRestaurants()
    }, [])


    const fetchRestaurants = async () => {
        try {
            const res = await axios.get("https://restaurant-backend-production-3168.up.railway.app/restaurants");
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <AppNavBar />
            <HeroSection />

            <Container className="my-5">
                {/* <RestaurantMap restaurants={restaurants} /> */}
                <br />
                {loading ? (
                    <p className="text-center">Loading restaurants...</p>
                ) : (
                    <Row>
                        {restaurants.map((restaurant) => (
                            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                        ))}
                    </Row>
                )}
                <h2 className="text-center mb-4 mt-5">Find Us</h2>
                <RestaurantMap restaurants={restaurants} />
            </Container>
        </div>
    )
}