import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Harmonize</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="justify-content-end">
              {/* In the future, content will change based on logged in status */}
              <Nav.Item>
                <Nav.Link href="/form">List Event</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/eventsearch">Events</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/calculator">Calculator</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/account">Account</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="content">
        {children} {/* Render the content of the page */}
      </div>
      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">
            &copy;2024 Harmonize. All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};
export default Layout;
