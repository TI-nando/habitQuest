import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p className="footer-text">
            © 2024 HabitQuest RPG - Transforme sua produtividade em uma aventura épica! 🎮
          </p>
          <div className="footer-links">
            <span className="footer-version">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer