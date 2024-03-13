import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Account from './pages/Account';
import Events from './pages/Events';
import EventForm from './pages/EventForm';
import Profile from './pages/Profile';
import IndividualEvent from './pages/IndividualEvent';
import Calculator from './pages/Calculator';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Landing />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/account/:id"
            element={
              <Layout>
                <Account />
              </Layout>
            }
          />
          <Route
            path="/eventsearch"
            element={
              <Layout>
                <Events />
              </Layout>
            }
          />
          <Route
            path="/form/:id?"
            element={
              <Layout>
                <EventForm />
              </Layout>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/event/:id"
            element={
              <Layout>
                <IndividualEvent />
              </Layout>
            }
          />
          <Route
            path="/calculator/:id?"
            element={
              <Layout>
                <Calculator />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
