import React from 'react';
import { useState } from 'react';
import { Container, Form, Col, Row, InputGroup, Button } from 'react-bootstrap';
import moment from 'moment';
import TooltipButton from '../components/TooltipButton';

const Calculator = () => {
  //States
  const [gigNumEnabled, setGigNumEnabled] = useState(false);
  const [totalMileageEnabled, setTotalMileageEnabled] = useState(false);
  const [mileageCoveredEnabled, setMileageCoveredEnabled] = useState(false);
  const [individualPracticeEnabled, setIndividualPracticeEnabled] =
    useState(false);
  const [rehearsalHoursEnabled, setRehearsalHoursEnabled] = useState(false);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [otherFeesEnabled, setOtherFeesEnabled] = useState(false);
  const [hourlyWage] = useState(0.0);

  return (
    <div>
      <h2>Calculator</h2>
      <hr />
      <Container className="" style={{ textAlign: 'left' }}>
        <h3>Basic Information</h3>
        <hr />
        <Form>
          <Form.Group>
            <Row className="mb-3" xs={1} lg={2}>
              <Col lg="8">
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Calculator Name (required)"></Form.Control>
              </Col>
              <Col lg="4">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={moment().format('YYYY-MM-DD')}
                ></Form.Control>
              </Col>
            </Row>
            <Row className="mb-3" xs={1} lg={3}>
              <Col>
                <Form.Label>Pay per gig</Form.Label>
                <InputGroup>
                  <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                  <Form.Control placeholder="Ex. 100.00 (required)"></Form.Control>
                  <TooltipButton text="" />
                </InputGroup>
              </Col>
              <Col>
                <Form.Label>Hours per gig</Form.Label>
                <InputGroup>
                  <Form.Control placeholder="Ex. 3 (required)"></Form.Control>
                  <TooltipButton text="" />
                </InputGroup>
              </Col>
              <Col>
                <Form.Label>Number of gigs</Form.Label>
                <InputGroup>
                  <Form.Check
                    type="switch"
                    style={{ marginTop: '5px', paddingLeft: '35px' }}
                    onChange={() => {
                      setGigNumEnabled(!gigNumEnabled);
                    }}
                    defaultValue={!gigNumEnabled}
                  ></Form.Check>
                  <Form.Control
                    placeholder="Ex. 1"
                    disabled={!gigNumEnabled}
                  ></Form.Control>
                  <TooltipButton text="" />
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
          <hr />
          <h3>Logistics</h3>
          <hr />
          <h4>Mileage</h4>
          <Form.Group>
            <Row className="mb-3" xs={1} lg={2}>
              <Col>
                <Row className="mb-1">
                  <Form.Label>Total Mileage</Form.Label>
                  <InputGroup>
                    <Form.Check
                      type="switch"
                      style={{ marginTop: '5px', paddingLeft: '35px' }}
                      onChange={() => {
                        setTotalMileageEnabled(!totalMileageEnabled);
                      }}
                      defaultValue={!totalMileageEnabled}
                    ></Form.Check>
                    <Form.Control
                      placeholder="Ex. 20"
                      disabled={!totalMileageEnabled}
                    ></Form.Control>
                    <Button variant="light">Calculate based on location</Button>
                    <TooltipButton text="" />
                    {/* USE BOOTSTRAP MODAL OR OFF CANVAS FOR CALCULATION MENU*/}
                  </InputGroup>
                </Row>
                <Row className="mb-3">
                  <Form.Label>Mileage Covered</Form.Label>
                  <InputGroup>
                    <Form.Check
                      type="switch"
                      style={{ marginTop: '5px', paddingLeft: '35px' }}
                      onChange={() => {
                        setMileageCoveredEnabled(!mileageCoveredEnabled);
                      }}
                      defaultValue={!mileageCoveredEnabled}
                    ></Form.Check>
                    <Form.Control
                      placeholder="Ex. 20"
                      disabled={!mileageCoveredEnabled}
                    ></Form.Control>
                    <TooltipButton text="" />
                  </InputGroup>
                </Row>
              </Col>
              <Col>
                <Form.Label>Gas Price per Mile</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control
                    placeholder="Ex. 0.30"
                    disabled={!totalMileageEnabled}
                  ></Form.Control>
                  <Button variant="light">Use Average</Button>
                  <TooltipButton text="" />
                </InputGroup>
                <Col md={{ offset: 1 }}>
                  <Row>
                    <InputGroup>
                      <InputGroup.Text>Gas $/Gallon</InputGroup.Text>
                      <Form.Control
                        placeholder="Ex. 0.30"
                        disabled={!totalMileageEnabled}
                      ></Form.Control>
                      <TooltipButton text="" />
                    </InputGroup>
                  </Row>
                  <Row>
                    <InputGroup>
                      <InputGroup.Text>Vehicle MPG</InputGroup.Text>
                      <Form.Control
                        placeholder="Ex. 20"
                        disabled={!totalMileageEnabled}
                      ></Form.Control>
                      <TooltipButton text="" />
                    </InputGroup>
                  </Row>
                </Col>
              </Col>
            </Row>
          </Form.Group>
          <hr />
          <h4>Additional Hours</h4>
          <Form.Group>
            <Row className="mb-3" xs={1} lg={2}>
              <Col>
                <Form.Label>Individual Practice Hours</Form.Label>
                <InputGroup>
                  <Form.Check
                    type="switch"
                    style={{ marginTop: '5px', paddingLeft: '35px' }}
                    onChange={() => {
                      setIndividualPracticeEnabled(!individualPracticeEnabled);
                    }}
                    defaultValue={!individualPracticeEnabled}
                  ></Form.Check>
                  <Form.Control
                    placeholder="Ex. 20"
                    disabled={!individualPracticeEnabled}
                  ></Form.Control>
                  <TooltipButton text="The total hours spent practicing for event (individually, not including group rehearsal)." />
                </InputGroup>
              </Col>
              <Col>
                <Form.Label>Rehearsal Hours</Form.Label>
                <InputGroup>
                  <Form.Check
                    type="switch"
                    style={{ marginTop: '5px', paddingLeft: '35px' }}
                    onChange={() => {
                      setRehearsalHoursEnabled(!rehearsalHoursEnabled);
                    }}
                    defaultValue={!rehearsalHoursEnabled}
                  ></Form.Check>
                  <Form.Control
                    placeholder="Ex. 20"
                    disabled={!rehearsalHoursEnabled}
                  ></Form.Control>
                  <TooltipButton text="The total hours spent in rehearsal for event (not including individual practice)." />
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
          <hr />
          <h4>Other Expenses</h4>
          <Form.Group>
            <Row className="mb-3" xs={1} lg={2}>
              <Col>
                <Form.Label>Income Tax Percentage</Form.Label>
                <InputGroup>
                  <Form.Check
                    type="switch"
                    style={{ marginTop: '5px', paddingLeft: '35px' }}
                    onChange={() => {
                      setTaxEnabled(!taxEnabled);
                    }}
                    defaultValue={!taxEnabled}
                  ></Form.Check>
                  <InputGroup.Text>%</InputGroup.Text>
                  <Form.Control
                    placeholder="Ex. 17.5"
                    disabled={!taxEnabled}
                  ></Form.Control>
                  <TooltipButton text="" />
                </InputGroup>
              </Col>
              <Col>
                <Form.Label>Other Frees</Form.Label>
                <InputGroup>
                  <Form.Check
                    type="switch"
                    style={{ marginTop: '5px', paddingLeft: '35px' }}
                    onChange={() => {
                      setOtherFeesEnabled(!otherFeesEnabled);
                    }}
                    defaultValue={!otherFeesEnabled}
                  ></Form.Check>
                  <Form.Control
                    placeholder="Ex. 20"
                    disabled={!otherFeesEnabled}
                  ></Form.Control>
                  <TooltipButton text="" />
                </InputGroup>
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <br />
        <hr />
        <Row>
          <Col>
            <h4>
              Total Hourly Wage:{' '}
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(hourlyWage)}
            </h4>
          </Col>
          <Col>
            <Container style={{ textAlign: 'right' }}>
              <Row xs={2} lg={2}>
                <Col lg="10">
                  <Button
                    variant="success"
                    style={{ paddingLeft: '15px', paddingRight: '15px' }}
                  >
                    Save
                  </Button>{' '}
                  {/* CHECK FOR ACCOUNT WHEN LOGIN WORKING */}
                </Col>
                <Col lg="1">
                  <Button
                    variant="secondary"
                    style={{ paddingLeft: '15px', paddingRight: '15px' }}
                  >
                    Export
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
      <br />
    </div>
  );
};

export default Calculator;
