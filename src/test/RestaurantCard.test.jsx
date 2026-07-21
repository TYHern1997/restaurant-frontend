import { render, screen } from '@testing-library/react'
import RestaurantCard from '../components/RestaurantCard'

const mockRestaurant = {
    id: 1,
    name: 'Marble 8',
    cuisine_type: 'Steakhouse',
    capacity: 90,
    location: 'KLCC, Kuala Lumpur',
    menu_url: null
}

test('rensders restaurant name', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    expect(screen.getByText('Marble 8')).toBeInTheDocument()
})

test('renders cuisine type', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    expect(screen.getByText('Steakhouse')).toBeInTheDocument()
})

test('does not show View Menu when menu_url is null', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    expect(screen.queryByText('View Menu')).not.toBeInTheDocument()
})