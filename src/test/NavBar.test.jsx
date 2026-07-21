import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AppNavBar from '../components/NavBar'

test('renders brand name', () => {
    render(
        <MemoryRouter>
            <AppNavBar />
        </MemoryRouter>
    )
    expect(screen.getByText('🍽️ Sigma Serve')).toBeInTheDocument()
})

test('show Sign In when not logged in', () => {
    localStorage.clear()
    render(
        <MemoryRouter>
            <AppNavBar />
        </MemoryRouter>
    )
    expect(screen.getByText('Sign In')).toBeInTheDocument()
})