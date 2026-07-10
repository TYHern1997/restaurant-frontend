import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon not showing in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RestaurantMap({ restaurants }) {
    return (
        <MapContainer
            center={[3.1500, 101.7000]}  // center of KL
            zoom={13}
            style={{ height: "400px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            />
            {restaurants.map((restaurant) => (
                restaurant.lat && restaurant.lng ? (
                    <Marker
                        key={restaurant.id}
                        position={[parseFloat(restaurant.lat), parseFloat(restaurant.lng)]}
                    >
                        <Popup>
                            <strong>{restaurant.name}</strong><br />
                            {restaurant.cuisine_type}<br />
                            Capacity: {restaurant.capacity} guests
                        </Popup>
                    </Marker>
                ) : null
            ))}
        </MapContainer>
    );
}