import './App.css';
import {useState} from "react";
import Axios from 'axios';
import NavigationBar from "./components/navigationBar.js";
import ReactMap from "./components/map.js";


function App() {
    const [listOfPackages, setListOfPackages] = useState([]);
    let dateInput1, dateInput2, userInput, packageInput;

    //search in the database for user ID and the inputted time period
    async function DisplayUserData(e) {
        e.preventDefault();
        inputValidation();
        await Axios.get("http://localhost:3001/findData/"+userInput+"/"+dateInput1+"/"+dateInput2+"", {
        }).then((response) => {
            setListOfPackages(response.data);
        });
        await Axios.put("http://localhost:3001/findData/"+userInput+"/"+dateInput1+"/"+dateInput2+"", {});
    }

    async function DisplayPackageData(e) {
        e.preventDefault();
        packageInput = document.getElementById('package_id').value;
        await Axios.get("http://localhost:3001/findData/"+packageInput, {})
            .then((response) => {
            setListOfPackages(response.data);
        });
          await Axios.put("http://localhost:3001/findData/"+packageInput, {});
    }

    function dataExportUser(e) {
        e.preventDefault();
        inputValidation();

        Axios.post('http://localhost:3001/dataExportUser', {
            "userid": userInput,
            "date1": dateInput1,
            "date2": dateInput2,
        }).then(alert("Exported data of " + userInput + " from " + dateInput1 + " to " + dateInput2 + "!"));
    }

    function dataExportAll(e) {
        e.preventDefault();
        inputValidation();
        Axios.post('http://localhost:3001/dataExportAll')
        .then(alert("Exported entire database!"));
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
            <NavigationBar/>
            <div className="packagesDisplay">
                <div className="formInput">
                    <form onSubmit={DisplayUserData}>
                        <div className='dateInput'>
                            <p></p>
                            <label htmlFor="user_id"><strong>&nbsp; User ID: </strong></label>
                            <input type="text" id="user_id" name="user_id" required></input>
                            <label htmlFor="name"> <strong>&nbsp;&nbsp;&nbsp;  From:  </strong></label>
                            <input type="date" id="date_input1" name="date_input1" required/>
                            <label htmlFor="name"> <strong>&nbsp;&nbsp;&nbsp; To: </strong></label>
                            <input type="date" id="date_input2" name="date_input2" required/>
                            <p></p>
                            <input type="submit" id="display" name="display" value="Display"/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="submit" value="Export Data" onClick={dataExportUser}/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="submit" value="Export Entire Database" onClick={dataExportAll}/>
                        </div>
                    </form>
                    <form onSubmit={DisplayPackageData}>
                        <div className='dateInput'>
                            <p></p>
                            <label htmlFor="package_id"><strong>Package ID: </strong></label>
                            <input type="text" id="package_id" name="package_id" required></input>
                            <input type="submit" id="display" name="display" value="Display"/>
                            <hr size="3" width="110%" color="black"></hr>
                        </div>
                    </form>
                    {listOfPackages.map((package_data) => {
                        return <div>
                            <h1>Item ID: {package_data.item_id}</h1>
                            <h2>Client ID: {package_data.client_id}</h2>
                            <h2>Status: {package_data.status}</h2>
                            <h2>Date: {package_data.date}</h2>
                            <h2>Storage ID: {package_data.storage_id}</h2>
                            <h2>Coordinates (Long - Lat): {package_data.location.coordinates[0]}° - {package_data.location.coordinates[1]}°</h2>
                            <h2>Distance to destination: {package_data.dist_in_km.toFixed(2)} km</h2>
                            <h2>Estimated time left: {Math.round(package_data.delivery_time_in_mins)} minutes</h2>
                        </div>
                    })}
                </div>
            </div>
            <ReactMap/>
        </div>
    );
}

export default App;
