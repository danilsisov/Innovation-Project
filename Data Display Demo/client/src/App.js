import './App.css';
import {useState, useEffect} from "react";
import Axios from 'axios';


function App() {
    const [listOfPackages, setListOfPackages] = useState([]);

    useEffect(() => {
        Axios.get("http://localhost:3001/getPackages").then((response) => {
            setListOfPackages(response.data);
        })
    }, []);

  return (
    <div className="App">

        <div className="packagesDisplay">
          {listOfPackages.map((package_data) => {
              return <div>
                  <h1>Item ID: {package_data.item_id}</h1>
                  <h2>Client ID: {package_data.client_id}</h2>
                  <h2>Date: {package_data.date}</h2>
                  <h2>Storage ID: {package_data.storage_id}</h2>
                  <h2>Location ID: {package_data.location_id}</h2>
                  <h2>Coordinates: {package_data.geometry.location_coords}</h2>
                  <h2>Status: {package_data.status}</h2>
              </div>
          })}
        </div>
    </div>
  );
}

export default App;
