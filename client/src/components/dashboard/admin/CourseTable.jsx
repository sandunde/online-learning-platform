import React from 'react';
import { Table, Button } from 'react-bootstrap';

const CoursesTable = ({ coursesList, openCourseModal, handleDeleteCourse }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Level</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(coursesList) && coursesList.map((course) => (
          <tr key={course._id}>
            <td>{course.name}</td>
            <td>{course.level}</td>
            <td>{course.description}</td>
            <td>
              <Button
                variant="warning"
                className="me-2"
                onClick={() => openCourseModal(course)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteCourse(course._id)}
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

export default CoursesTable;
