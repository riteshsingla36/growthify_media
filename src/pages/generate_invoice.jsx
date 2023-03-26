import User from 'models/user.model';
import React, { useState } from 'react';
import { connectDB } from 'setup/connectDb';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const GenerateInvoice = (props) => {
  const user = props.user;
  const [hsnCode, setHsnCode] = useState('');
  const handleChange = (e) => {
    if(e.target.id === 'formGridHSNCode') {
      setHsnCode(e.target.value);
    }
  }

  return (
    <>
      {props.user && (
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
          </Row>

          {/* <Form.Group className="mb-3" controlId="formGridAddress1">
            <Form.Label>Address</Form.Label>
            <Form.Control placeholder="1234 Main St" />
          </Form.Group> */}

          <Form.Group className="mb-3" controlId="formGridBillingAddress">
            <Form.Label>Billing Address</Form.Label>
            <Form.Control
              placeholder="Apartment, studio, or floor"
              value={user.billingAddress}
              onChange={e => handleChange(e)}
              disabled
            />
          </Form.Group>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridHSNCode">
              <Form.Label>HSN Code</Form.Label>
              <Form.Control onChange={e => handleChange(e)} />
            </Form.Group>

            {/* <Form.Group as={Col} controlId="formGridState">
              <Form.Label>State</Form.Label>
              <Form.Select defaultValue="Choose...">
                <option>Choose...</option>
                <option>...</option>
              </Form.Select>
            </Form.Group> */}

            <Form.Group as={Col} controlId="formGridStateCode">
              <Form.Label>State Code</Form.Label>
              <Form.Control disabled onChange={e => handleChange(e)} value={user.stateCode} />
            </Form.Group>
          </Row>

          {/* <Form.Group className="mb-3" id="formGridCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const clientId = context.query.clientId;
  console.log(clientId, 'clientId');
  await connectDB();
  const user = await User.findOne({ _id: clientId });
  console.log(user, 'user');
  return {
    props: { user: JSON.parse(JSON.stringify(user)) }, // will be passed to the page component as props
  };
}

export default GenerateInvoice;
