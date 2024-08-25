import React from 'react';
import { Table, Button } from 'react-bootstrap';

const StudentsTable = ({ studentsList, openStudentModal, handleDeleteStudent }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {studentsList.map((student) => (
          <tr key={student._id}>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>
              <Button
                variant="warning"
                className="me-2"
                onClick={() => openStudentModal(student)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteStudent(student._id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default StudentsTable;
