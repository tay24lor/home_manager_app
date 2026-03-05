import { useNavigate } from "react-router-dom";
import "../styles/Home.css";


function Home() {
    const navigate = useNavigate();

    function toCars() {
        navigate(`/Carlist`);
    }

    function toFuseBox() {
        navigate(` /FuseBox`);
    }

  return (
    <>
      <header id='home-header'>
        <h1>Menu</h1>
      </header>
      <div id="menu" className="menu">
        <button onClick={toCars} className="card">
            Vehicles
        </button>
        <button onClick={toFuseBox} className="card">
            Breaker Panel
        </button>
        <button className="card">
          
            Coming Soon!
        </button>
      </div>
    </>
  )
}

export default Home;
