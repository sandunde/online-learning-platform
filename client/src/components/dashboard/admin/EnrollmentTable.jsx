import React from 'react';
import { Table, Button } from 'react-bootstrap';

const EnrollmentTable = ({ enrollmentsList, handleDeleteEnrollment }) => {
    const filteredEnrollments = enrollmentsList.filter(enrollment => enrollment.students.length > 0);

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Student Name(s)</th>
                    <th>Course Name</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {filteredEnrollments.length > 0 ? (
                    filteredEnrollments.map(enrollment => (
                        <tr key={enrollment._id}>
                            <td>
                                {enrollment.students.length > 0
                                    ? enrollment.students.map(student => student.name).join(', ')
                                    : 'N/A'}
                            </td>
                            <td>{enrollment.courseName || 'N/A'}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDeleteEnrollment(enrollment._id)}>Delete</Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center">No enrollments found</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
};

export default EnrollmentTable;
