import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
              <div className="logo-icon">💻</div>
              <h1 className="logo-text">HabitDev</h1>
            </div>
          <nav className="navigation">
            <button className="nav-button active">Dashboard</button>
            <button className="nav-button">Missões</button>
            <button className="nav-button">Conquistas</button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header