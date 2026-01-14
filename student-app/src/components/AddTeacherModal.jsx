import { useState, useEffect } from 'react';
import './AddStudentModal.css'; // Reusing standard modal styles

const AddTeacherModal = ({ isOpen, onClose, onSubmit, editingTeacher }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department: '',
        subjects: '',
        photo: null
    });

    useEffect(() => {
        if (editingTeacher) {
            setFormData({
                ...editingTeacher,
                subjects: editingTeacher.subjects ? editingTeacher.subjects.join(', ') : ''
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                department: '',
                subjects: '',
                photo: null
            });
        }
    }, [editingTeacher, isOpen]);

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
                        {editingTeacher ? '✏️ Edit Teacher' : '➕ Add New Teacher'}
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
                                    <span>👨‍🏫</span>
                                </div>
                            )}
                        </div>
                        <div className="photo-input-group">
                            <label htmlFor="teacher-photo">Teacher Photo</label>
                            <input
                                type="file"
                                id="teacher-photo"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="input-file"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="t-name">Full Name</label>
                            <input
                                type="text"
                                id="t-name"
                                name="name"
                                className="input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter teacher name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="t-email">Email Address</label>
                            <input
                                type="email"
                                id="t-email"
                                name="email"
                                className="input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="teacher@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="t-phone">Phone Number</label>
                            <input
                                type="text"
                                id="t-phone"
                                name="phone"
                                className="input"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1234567890"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="t-dept">Department</label>
                            <input
                                type="text"
                                id="t-dept"
                                name="department"
                                className="input"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g., Computer Science"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="t-subjects">Assigned Subjects (comma-separated)</label>
                        <input
                            type="text"
                            id="t-subjects"
                            name="subjects"
                            className="input"
                            value={formData.subjects}
                            onChange={handleChange}
                            placeholder="e.g., Mathematics, Physics"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingTeacher ? 'Update Details' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;
