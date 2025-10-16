import React from 'react'
import './StatsChart.css'

const StatsChart = ({ 
  data = [], 
  type = 'bar', 
  title, 
  color = '#667eea',
  height = 200,
  showValues = true,
  animate = true 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="stats-chart empty">
        <div className="chart-title">{title}</div>
        <div className="empty-message">Nenhum dado disponível</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => item.value))
  const minValue = Math.min(...data.map(item => item.value))
  const range = maxValue - minValue || 1

  const renderBarChart = () => (
    <div className="chart-container bar-chart" style={{ height }}>
      <div className="chart-bars">
        {data.map((item, index) => {
          const barHeight = ((item.value - minValue) / range) * (height - 60)
          const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0
          
          return (
            <div key={index} className="bar-wrapper">
              <div className="bar-label">{item.label}</div>
              <div className="bar-container">
                <div 
                  className={`bar ${animate ? 'animated' : ''}`}
                  style={{ 
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    animationDelay: animate ? `${index * 0.1}s` : '0s'
                  }}
                />
                {showValues && (
                  <div className="bar-value">{item.value}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / range) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="chart-container line-chart" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Área sob a linha */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#gradient-${color.replace('#', '')})`}
            className={animate ? 'animated-area' : ''}
          />
          
          {/* Linha */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className={animate ? 'animated-line' : ''}
          />
          
          {/* Pontos */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value - minValue) / range) * 100
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                className={animate ? 'animated-point' : ''}
                style={{ animationDelay: animate ? `${index * 0.1}s` : '0s' }}
              />
            )
          })}
        </svg>
        
        <div className="line-chart-labels">
          {data.map((item, index) => (
            <div key={index} className="line-label">
              <span className="label-text">{item.label}</span>
              {showValues && <span className="label-value">{item.value}</span>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0

    return (
      <div className="chart-container pie-chart" style={{ height }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f0f0f0" strokeWidth="2"/>
          
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (item.value / total) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            
            currentAngle += angle
            
            const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180)
            const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180)
            const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180)
            const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
            const segmentColor = colors[index % colors.length]
            
            return (
              <path
                key={index}
                d={pathData}
                fill={segmentColor}
                className={animate ? 'animated-segment' : ''}
                style={{ animationDelay: animate ? `${index * 0.2}s` : '0s' }}
              />
            )
          })}
        </svg>
        
        <div className="pie-chart-legend">
          {data.map((item, index) => {
            const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
            const segmentColor = colors[index % colors.length]
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            
            return (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: segmentColor }}
                />
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">
                  {showValues ? `${item.value} (${percentage}%)` : `${percentage}%`}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      case 'bar':
      default:
        return renderBarChart()
    }
  }

  return (
    <div className="stats-chart">
      {title && <div className="chart-title">{title}</div>}
      {renderChart()}
    </div>
  )
}

export default StatsChart