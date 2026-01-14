import { useState } from 'react';
import './FeesSection.css';

const FeesSection = ({ feeStructures, feePayments, students, onAddPayment, onAddFeeStructure }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedPayment, setSelectedPayment] = useState(null); // For receipt
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [paymentForm, setPaymentForm] = useState({
        studentId: '',
        amount: '',
        type: 'Tuition',
        paymentMethod: 'Card',
        description: ''
    });

    const [structureForm, setStructureForm] = useState({
        course: '',
        year: new Date().getFullYear().toString(),
        amount: '',
        title: '',
        dueDate: ''
    });

    const courses = [...new Set(students.map(s => s.course))];

    // Stats
    const totalCollected = feePayments.reduce((acc, curr) => acc + curr.amount, 0);
    // Simple calculation for pending: Total expected based on students enrolled vs collected
    // This is approximate for demo
    const totalExpected = students.reduce((acc, student) => {
        const structure = feeStructures.find(f => f.course === student.course);
        return acc + (structure ? structure.amount : 0);
    }, 0);
    const totalPending = totalExpected - totalCollected;

    const handleCollectSubmit = (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === parseInt(paymentForm.studentId));
        if (student) {
            onAddPayment({
                ...paymentForm,
                studentId: parseInt(paymentForm.studentId),
                amount: parseFloat(paymentForm.amount),
                date: new Date().toISOString().split('T')[0],
                studentName: student.name // Denormalize for easier display
            });
            alert('Payment recorded successfully!');
            setActiveTab('transactions');
            setPaymentForm({
                studentId: '',
                amount: '',
                type: 'Tuition',
                paymentMethod: 'Card',
                description: ''
            });
        }
    };

    const handleStructureSubmit = (e) => {
        e.preventDefault();
        onAddFeeStructure({
            ...structureForm,
            amount: parseFloat(structureForm.amount)
        });
        alert('Fee Structure added!');
        setStructureForm({
            course: '',
            year: new Date().getFullYear().toString(),
            amount: '',
            title: '',
            dueDate: ''
        });
    };

    const filteredPayments = feePayments.filter(p => {
        const student = students.find(s => s.id === p.studentId);
        const name = student ? student.name.toLowerCase() : '';
        return name.includes(searchTerm.toLowerCase()) ||
            p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="fees-container">
            <div className="fees-header">
                <h2 className="fees-title">Fees Management</h2>
                <p className="fees-subtitle">Track payments, manage structures, and generate receipts</p>
            </div>

            <div className="fees-tabs">
                <button
                    className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                >📊 Dashboard</button>
                <button
                    className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >📜 Transactions</button>
                <button
                    className={`tab-btn ${activeTab === 'collect' ? 'active' : ''}`}
                    onClick={() => setActiveTab('collect')}
                >💰 Collect Fees</button>
                <button
                    className={`tab-btn ${activeTab === 'structures' ? 'active' : ''}`}
                    onClick={() => setActiveTab('structures')}
                >⚙️ Fee Structures</button>
            </div>

            <div className="tab-content">
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <>
                        <div className="financial-stats">
                            <div className="stat-card green">
                                <h3>Total Collected</h3>
                                <div className="value">${totalCollected.toLocaleString()}</div>
                            </div>
                            <div className="stat-card red">
                                <h3>Total Pending (Approx)</h3>
                                <div className="value">${totalPending > 0 ? totalPending.toLocaleString() : 0}</div>
                            </div>
                            <div className="stat-card blue">
                                <h3>Transactions</h3>
                                <div className="value">{feePayments.length}</div>
                            </div>
                        </div>

                        <div className="fees-card">
                            <h3>Recent Payments</h3>
                            <div className="table-responsive">
                                <table className="attendance-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Student</th>
                                            <th>Amount</th>
                                            <th>Type</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feePayments.slice(-5).reverse().map(payment => {
                                            const student = students.find(s => s.id === payment.studentId);
                                            return (
                                                <tr key={payment.id}>
                                                    <td>{payment.date}</td>
                                                    <td>{student?.name || 'Unknown'}</td>
                                                    <td>${payment.amount}</td>
                                                    <td>{payment.type}</td>
                                                    <td>
                                                        <span className="status-badge completed">Completed</span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Transactions Tab */}
                {activeTab === 'transactions' && (
                    <div className="fees-card">
                        <div className="grades-controls">
                            <input
                                type="text"
                                placeholder="Search by student or transaction ID..."
                                className="input"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ maxWidth: '300px' }}
                            />
                        </div>
                        <div className="table-responsive">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Transaction ID</th>
                                        <th>Date</th>
                                        <th>Student</th>
                                        <th>Amount</th>
                                        <th>Method</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map(payment => {
                                        const student = students.find(s => s.id === payment.studentId);
                                        return (
                                            <tr key={payment.id}>
                                                <td>{payment.transactionId}</td>
                                                <td>{payment.date}</td>
                                                <td>{student?.name || 'Unknown'}</td>
                                                <td>${payment.amount}</td>
                                                <td>{payment.paymentMethod}</td>
                                                <td>{payment.description}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setActiveTab('receipt');
                                                        }}
                                                    >
                                                        Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Collect Fees Tab */}
                {activeTab === 'collect' && (
                    <div className="fees-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h3>Record New Payment</h3>
                        <br />
                        <form onSubmit={handleCollectSubmit}>
                            <div className="form-group">
                                <label>Student</label>
                                <select
                                    className="input"
                                    required
                                    value={paymentForm.studentId}
                                    onChange={e => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    min="1"
                                    value={paymentForm.amount}
                                    onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Payment Type</label>
                                <select
                                    className="input"
                                    value={paymentForm.type}
                                    onChange={e => setPaymentForm({ ...paymentForm, type: e.target.value })}
                                >
                                    <option>Tuition</option>
                                    <option>Exam Fee</option>
                                    <option>Transport</option>
                                    <option>Library Fine</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Payment Method</label>
                                <select
                                    className="input"
                                    value={paymentForm.paymentMethod}
                                    onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                                >
                                    <option>Card</option>
                                    <option>Cash</option>
                                    <option>Online Transfer</option>
                                    <option>Cheque</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description (Optional)</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={paymentForm.description}
                                    onChange={e => setPaymentForm({ ...paymentForm, description: e.target.value })}
                                    placeholder="e.g. Semester 2 Installment"
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Record Payment</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Fee Structures Tab */}
                {activeTab === 'structures' && (
                    <div className="fees-card">
                        <h3>Defined Fee Structures</h3>
                        <br />
                        <div className="table-responsive" style={{ marginBottom: '2rem' }}>
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Course</th>
                                        <th>Year</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeStructures.map(structure => (
                                        <tr key={structure.id}>
                                            <td>{structure.title}</td>
                                            <td>{structure.course}</td>
                                            <td>{structure.year}</td>
                                            <td>${structure.amount}</td>
                                            <td>{structure.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3>Add New Structure</h3>
                        <br />
                        <form onSubmit={handleStructureSubmit} style={{ maxWidth: '600px' }}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    className="input"
                                    required
                                    value={structureForm.title}
                                    onChange={e => setStructureForm({ ...structureForm, title: e.target.value })}
                                    placeholder="e.g. Annual Fees 2025"
                                />
                            </div>
                            <div className="form-group">
                                <label>Course</label>
                                <select
                                    className="input"
                                    required
                                    value={structureForm.course}
                                    onChange={e => setStructureForm({ ...structureForm, course: e.target.value })}
                                >
                                    <option value="">Select Course</option>
                                    {courses.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Year</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    value={structureForm.year}
                                    onChange={e => setStructureForm({ ...structureForm, year: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Amount ($)</label>
                                <input
                                    type="number"
                                    className="input"
                                    required
                                    value={structureForm.amount}
                                    onChange={e => setStructureForm({ ...structureForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    required
                                    value={structureForm.dueDate}
                                    onChange={e => setStructureForm({ ...structureForm, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Add Structure</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Receipt View (Psuedo-Modal) */}
                {activeTab === 'receipt' && selectedPayment && (
                    <div className="receipt-view">
                        <button className="btn btn-outline" onClick={() => setActiveTab('transactions')} style={{ marginBottom: '1rem' }}>← Back to List</button>
                        <div className="receipt-container">
                            <div className="receipt-header">
                                <div className="receipt-logo">🎓 EduManage</div>
                                <h3>Payment Receipt</h3>
                                <p>Date: {selectedPayment.date}</p>
                            </div>

                            <div className="receipt-body">
                                <div className="receipt-row">
                                    <label>Transaction ID:</label>
                                    <span>{selectedPayment.transactionId}</span>
                                </div>
                                <div className="receipt-row">
                                    <label>Student Name:</label>
                                    <span>{students.find(s => s.id === selectedPayment.studentId)?.name}</span>
                                </div>
                                <div className="receipt-row">
                                    <label>Student ID:</label>
                                    <span>STU-{selectedPayment.studentId}</span>
                                </div>
                                <div className="receipt-row">
                                    <label>Payment Method:</label>
                                    <span>{selectedPayment.paymentMethod}</span>
                                </div>
                                <div className="receipt-row">
                                    <label>Type:</label>
                                    <span>{selectedPayment.type}</span>
                                </div>
                                <div className="receipt-row">
                                    <label>Description:</label>
                                    <span>{selectedPayment.description || '-'}</span>
                                </div>

                                <div className="receipt-total">
                                    <div className="receipt-row">
                                        <label>Amount Paid:</label>
                                        <span>${selectedPayment.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-primary print-btn" onClick={() => window.print()}>Print Receipt</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeesSection;
