import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Events from "./pages/Events";
import EventForm from "./pages/EventForm";
import Profile from "./pages/Profile";
import IndividualEvent from "./pages/IndividualEvent";
import Calculator from "./pages/Calculator";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/account/:id" element={<Account/>}/>
          <Route path="/eventsearch" element={<Events/>}/>
          <Route path="/form/:id?" element={<EventForm/>}/>
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/event/:id" element={<IndividualEvent/>}/>
          <Route path="/calculator/:id?" element={<Calculator/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
