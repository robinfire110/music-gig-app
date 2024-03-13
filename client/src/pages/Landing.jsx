import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import EventCard from '../components/EventCard';
import axios from 'axios';

function Landing() {
  //State Variables
  const [recentEvents, setRecentEvents] = useState();

  //Get recent event on first load
  useEffect(() => {
    axios
      .get(`http://localhost:5000/event/recent/6`)
      .then(res => {
        setRecentEvents(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Container>
        <h1>Harmonize</h1>
        <h3>Connecting musicians and organizers.</h3>
        <Container>
          <br />
          <hr />
          <h2>Recently Added Events</h2>
          <Row>
            {recentEvents &&
              recentEvents.map(event => {
                return (
                  <Col>
                    <EventCard eventId={event.event_id} />
                  </Col>
                );
              })}
          </Row>
        </Container>
        <Container>
          <br />
          <hr />
          <h2>Your Events</h2>
          <Button variant="primary">Register now to create events!</Button>
        </Container>
      </Container>
    </div>
  );
}

export default Landing;
