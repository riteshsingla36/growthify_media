import axios from 'axios';
import User from 'models/user.model';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';
import { connectDB } from 'setup/connectDb';

function Customers(props) {
  return (
    <Table responsive striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>User ID</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>User Type</th>
          <th>Status</th>
          <th>Role</th>
          <th>CreatedBy</th>
          <th>Projects</th>
          <th>Brand Name</th>
          <th>Billing Phone No</th>
          <th>GSTIN</th>
          <th>Billing Address</th>
          <th>State Code</th>
          <th>Generate Invoice</th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user, index) => {
          return (
            <tr key={user._id}>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.phoneNo}</td>
              <td>{user.email}</td>
              <td>{user.userType}</td>
              <td>{user.status}</td>
              <td>{user.role}</td>
              <td>{user.createdBy}</td>
              <th>{user.projects}</th>
              <th>{user.brandName}</th>
              <th>{user.billingPhoneNo}</th>
              <th>{user.GSTIN}</th>
              <th>{user.billingAddress}</th>
              <th>{user.stateCode}</th>
              <th><Link href={`/generate_invoice?clientId=${user.userId}`} ><button style={{color: 'white', backgroundColor: "#00264D", borderRadius: '10px'}}>Generate Invoice</button></Link></th>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export async function getServerSideProps(context) {
  await connectDB();
  const users = await User.find({userType: 'Client'});
  return {
    props: { users: JSON.parse(JSON.stringify(users)) }, // will be passed to the page component as props
  };
}

export default Customers;
