import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";


function Home() {
    const navigate = useNavigate();

    function toCars() {
        navigate(`/Carlist`);
    }

  return (
    <>
      <header>
        Menu
      </header>
      <div id="menu" className="menu">
        <button onClick={toCars} className="card">
            Cars
        </button>
        <button className="card">
          <Link to="/Carlist">
            Cars
          </Link>
        </button>
        <button className="card">
          <Link to="/Carlist">
            Cars
          </Link>
        </button>
        <button className="card">
          <Link to="/Carlist">
            Cars
          </Link>
        </button>
      </div>
    </>
  )
}

export default Home;
