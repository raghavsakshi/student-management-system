import './StatCard.css';

const StatCard = ({ icon, value, label, trend, color = 'purple' }) => {
    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-icon-wrapper">
                <span className="stat-icon">{icon}</span>
            </div>

            <div className="stat-content">
                <h3 className="stat-value">{value}</h3>
                <p className="stat-label">{label}</p>

                {trend && (
                    <div className={`stat-trend ${trend.direction}`}>
                        <span className="trend-icon">
                            {trend.direction === 'up' ? '↑' : '↓'}
                        </span>
                        <span className="trend-value">{trend.value}%</span>
                        <span className="trend-text">vs last month</span>
                    </div>
                )}
            </div>

            <div className="stat-bg-decoration"></div>
        </div>
    );
};

export default StatCard;
