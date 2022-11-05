import './App.css';
import {useState} from "react";
import Axios from 'axios';

function App() {
    const [listOfPackages, setListOfPackages] = useState([]);
    let dateInput1, dateInput2, userInput;

    async function dataDisplay(e) {
        e.preventDefault();
        inputValidation();
        Axios.get("http://localhost:3001/findData/"+userInput+"/"+dateInput1+"/"+dateInput2+"", {
        }).then((response) => {
            setListOfPackages(response.data);
        })
    }

    async function dataExport(e) {
        e.preventDefault();
        inputValidation();

        await fetch('http://localhost:3001/dataExport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "searched_uid": userInput,
                "date1": dateInput1,
                "date2": dateInput2,
            })
        }).then(alert("Exported data of " + userInput + " from " + dateInput1 + " to " + dateInput2 + "!"));
    }

    async function dataExportAll(e) {
        e.preventDefault();
        inputValidation();

        await fetch('http://localhost:3001/dataExportAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(alert("Exported entire database!"));
    }

    function inputValidation() {
        dateInput1 = document.getElementById('date_input1').value;
        dateInput2 = document.getElementById('date_input2').value;
        userInput = document.getElementById('user_id').value;

        if (dateInput1 > dateInput2) {
            alert("The 1st date must be before the 2nd date!");
            return false;
        }
    }

    return (
        <div className="App">
            <div className="formInput">
                <form onSubmit={dataDisplay}>
                    <div className='dateInput'>
                        <label htmlFor="user_id"> User ID:</label>
                        <input type="text" id="user_id" name="user_id" required></input>
                        <label htmlFor="name">From:</label>
                        <input type="date" id="date_input1" name="date_input1" required/>
                        <label htmlFor="name">To:</label>
                        <input type="date" id="date_input2" name="date_input2" required/>
                        <input type="submit" id="display" name="display" value="Display"/>
                        <input type="button" value="Export Data" onClick={dataExport}/>
                        <input type="button" value="Export Entire Database" onClick={dataExportAll}/>
                    </div>
                </form>
            </div>
            <div className="map">

            </div>
            <div className="packagesDisplay">
              {listOfPackages.map((package_data) => {
                  return <div>
                      <h1>Item ID: {package_data.item_id}</h1>
                      <h2>Client ID: {package_data.client_id}</h2>
                      <h2>Status: {package_data.status}</h2>
                      <h2>Date: {package_data.date}</h2>
                      <h2>Storage ID: {package_data.storage_id}</h2>
                      <h2>Coordinates: {package_data.geometry.user_address}</h2>
                      <h2>Distance to destination: {package_data.dist_in_km} km</h2>
                      <h2>Estimated time left: {Math.round(package_data.delivery_time_in_mins)} minutes</h2>
                  </div>
              })}
            </div>
        </div>
    );
}

export default App;
