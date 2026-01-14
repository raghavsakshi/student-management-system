import StatCard from './StatCard';
import './AdminSection.css';

const AdminSection = ({ totalStudents, totalTeachers, courseData }) => {
    return (
        <div className="admin-section">
            <div className="admin-header">
                <h2 className="admin-title">Admin Overview</h2>
            </div>

            <div className="stats-section">
                <StatCard
                    icon="👥"
                    value={totalStudents}
                    label="Total Students"
                    trend={{ direction: 'up', value: 12 }}
                    color="purple"
                />
                <StatCard
                    icon="👨‍🏫"
                    value={totalTeachers}
                    label="Total Teachers"
                    trend={{ direction: 'up', value: 5 }}
                    color="green"
                />
            </div>

            <div className="course-overview">
                <h3 className="overview-title">Course Overview</h3>
                <div className="course-grid">
                    {courseData.map((course, index) => (
                        <div key={index} className="course-card">
                            <div className="course-info">
                                <h4>{course.name}</h4>
                                <p>{course.department}</p>
                            </div>
                            <div className="course-stats">
                                <span className="student-count">{course.students} Students</span>
                                <div className="progress-bar-container">
                                    <div
                                        className="progress-bar"
                                        style={{ width: `${Math.min((course.students / 20) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSection;
