import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';

const AllTasks = (props) => {

  const columns = ['Status', 'Assignee', 'Assingnor', 'CreatedBy', 'OnBoadingResource', 'CreatedBy', 'Description' ];
  return (
    <Table responsive>
      <thead>
        <tr>
          <th>#</th>
          {columns.map((heading, index) => (
            <th key={index}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          {Array.from({ length: 7 }).map((_, index) => (
            <td key={index}>Table cell {index}</td>
          ))}
        </tr>
      </tbody>
    </Table>
  );
};

export async function getServerSideProps(context) {
  const tasks = await axios.get('https://growthify-media.vercel.app/api/get_users');
  return {
    props: { tasks: tasks.data },
  };
}

export default AllTasks;
