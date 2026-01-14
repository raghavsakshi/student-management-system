import { useState, useEffect } from 'react';
import './AddStudentModal.css';

const AddStudentModal = ({ isOpen, onClose, onSubmit, editingStudent }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        class: '',
        grade: 'A',
        status: 'Active',
        phone: '',
        address: '',
        photo: null
    });

    useEffect(() => {
        if (editingStudent) {
            setFormData(editingStudent);
        } else {
            setFormData({
                name: '',
                email: '',
                course: '',
                class: '',
                grade: 'A',
                status: 'Active',
                phone: '',
                address: '',
                photo: null
            });
        }
    }, [editingStudent, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    photo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        {editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="photo-upload-section">
                        <div className="photo-preview">
                            {formData.photo ? (
                                <img src={formData.photo} alt="Preview" />
                            ) : (
                                <div className="photo-placeholder">
                                    <span>📸</span>
                                </div>
                            )}
                        </div>
                        <div className="photo-input-group">
                            <label htmlFor="photo">Student Photo</label>
                            <input
                                type="file"
                                id="photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="input-file"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter student name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="student@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                className="input"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1234567890"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="class">Class</label>
                            <input
                                type="text"
                                id="class"
                                name="class"
                                className="input"
                                value={formData.class}
                                onChange={handleChange}
                                placeholder="e.g., 10-A"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="course">Course</label>
                        <input
                            type="text"
                            id="course"
                            name="course"
                            className="input"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="e.g., Computer Science"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <textarea
                            id="address"
                            name="address"
                            className="input"
                            style={{ minHeight: '80px', paddingTop: '10px' }}
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Full address here..."
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="grade">Grade</label>
                            <select
                                id="grade"
                                name="grade"
                                className="input"
                                value={formData.grade}
                                onChange={handleChange}
                            >
                                <option value="A+">A+</option>
                                <option value="A">A</option>
                                <option value="B+">B+</option>
                                <option value="B">B</option>
                                <option value="C+">C+</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="F">F</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingStudent ? 'Update Details' : 'Add Student'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
