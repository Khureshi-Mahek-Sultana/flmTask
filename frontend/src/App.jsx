import { useState, useEffect } from 'react'
import './App.css'
import Header from './Header'

function App() {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  useEffect(() => {
    fetch('https://flmtask-backend.onrender.com/api/companies')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch companies data')
        }
        return response.json()
      })
      .then(data => {
        setCompanies(data)
        setFilteredCompanies(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])



  const locations = [...new Set(companies.map(company => company.location))]
  const industries = [...new Set(companies.map(company => company.industry))]

  const handleSearch = () => {
    if (searchName.trim() && selectedLocation && selectedIndustry) {
      let filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchName.toLowerCase())
      )
      if (selectedLocation) {
        filtered = filtered.filter(company => company.location === selectedLocation)
      }
      if (selectedIndustry) {
        filtered = filtered.filter(company => company.industry === selectedIndustry)
      }
      setFilteredCompanies(filtered)
      setHasSearched(true)
    }
  }

  const handleLogin = (newToken) => {
    setToken(newToken);
    setIsLoggedIn(true);
    localStorage.setItem('token', newToken);
  }

  const handleLogout = () => {
    setToken('');
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="app">
      <Header isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-select"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select
          value={selectedIndustry}
          onChange={(e) => setSelectedIndustry(e.target.value)}
          className="filter-select"
        >
          <option value="">All Industries</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>
      <div className="company-grid">
        {filteredCompanies.map(company => (
          <div key={company._id} className="company-card">
            <h3 className="company-name">{company.name}</h3>
            <p className="company-location"><strong>Location:</strong> {company.location}</p>
            <p className="company-industry"><strong>Industry:</strong> {company.industry}</p>
          </div>
        ))}
      </div>
      {hasSearched && filteredCompanies.length === 0 && <p>No companies found matching the filters.</p>}
    </div>
  )
}

export default App
