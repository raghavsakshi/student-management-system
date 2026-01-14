import { useState, useEffect } from 'react';
import './AddStudentModal.css'; // Reusing modal styles

const AddCourseModal = ({ isOpen, onClose, onSubmit, editingCourse, teachers }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: '',
        credits: 3,
        description: '',
        assignedTeacher: '',
        subjects: '',
        status: 'Active'
    });

    useEffect(() => {
        if (editingCourse) {
            setFormData({
                ...editingCourse,
                subjects: editingCourse.subjects ? editingCourse.subjects.join(', ') : ''
            });
        } else {
            setFormData({
                name: '',
                code: '',
                department: '',
                credits: 3,
                description: '',
                assignedTeacher: '',
                subjects: '',
                status: 'Active'
            });
        }
    }, [editingCourse, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'credits' || name === 'assignedTeacher' ? (value ? parseInt(value) : '') : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedData = {
            ...formData,
            subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s !== '')
        };
        onSubmit(submittedData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {editingCourse ? '✏️ Edit Course' : '➕ Add New Course'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="c-name">Course Name</label>
                            <input
                                type="text"
                                id="c-name"
                                name="name"
                                className="input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="c-code">Course Code</label>
                            <input
                                type="text"
                                id="c-code"
                                name="code"
                                className="input"
                                value={formData.code}
                                onChange={handleChange}
                                placeholder="e.g., CS101"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="c-dept">Department</label>
                            <input
                                type="text"
                                id="c-dept"
                                name="department"
                                className="input"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="c-credits">Credits</label>
                            <input
                                type="number"
                                id="c-credits"
                                name="credits"
                                className="input"
                                value={formData.credits}
                                onChange={handleChange}
                                min="1"
                                max="6"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="c-teacher">Assigned Teacher</label>
                        <select
                            id="c-teacher"
                            name="assignedTeacher"
                            className="input"
                            value={formData.assignedTeacher}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a teacher</option>
                            {teachers && teachers.map(teacher => (
                                <option key={teacher.id} value={teacher.id}>
                                    {teacher.name} - {teacher.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="c-subjects">Subjects (comma-separated)</label>
                        <input
                            type="text"
                            id="c-subjects"
                            name="subjects"
                            className="input"
                            value={formData.subjects}
                            onChange={handleChange}
                            placeholder="e.g., Programming, Algorithms, Data Structures"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="c-description">Description</label>
                        <textarea
                            id="c-description"
                            name="description"
                            className="input"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Course description"
                            rows="3"
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="c-status">Status</label>
                        <select
                            id="c-status"
                            name="status"
                            className="input"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingCourse ? 'Update Course' : 'Add Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCourseModal;
