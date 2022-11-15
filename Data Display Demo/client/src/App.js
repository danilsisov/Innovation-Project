import './App.css';
import {useState} from "react";
import Axios from 'axios';
import NavigationBar from "./components/navigationBar.js";
import ReactMap from "./components/map.js";
const fs = require('fs');


function App() {
    const [listOfPackages, setListOfPackages] = useState([]);
    let dateInput1, dateInput2, userInput, packageInput,Currentlongitude,Currentlatitude;

    //search in the database for user ID and the inputted time period
    async function DisplayUserData(e) {
        e.preventDefault();
        inputValidation();
        Axios.get("http://localhost:3001/findData/"+userInput+"/"+dateInput1+"/"+dateInput2+"", {
        }).then((response) => {
            setListOfPackages(response.data);
        })
    }

    async function DisplayPackageData(e) {
        e.preventDefault();
        packageInput = document.getElementById('package_id').value;
        await Axios.get("http://localhost:3001/findData/"+packageInput, {})
            .then((response) => {
            setListOfPackages(response.data);
            
        })
        var config = {
            method: 'patch',
            url: 'http://localhost:3001/showPackagelocation/'+packageInput,
            headers: { }
          };
          
          Axios(config, {})
          .then( (response) => {
             Currentlatitude = (response.data[0].location.coordinates[0]);
             Currentlongitude = (response.data[0].location.coordinates[1]);

             console.log(Currentlatitude);
             console.log(Currentlongitude);
             
          })
          .catch( (error) =>{
            console.log(error);
          });






          
      /* await Axios.patch("http://localhost:3001/showPackageOnMap/"+packageInput, {})
            .then((response) => {
                
            })
        //send axios get to update json file. should it be post instead?  */
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
                            <label htmlFor="user_id">User ID:</label>
                            <input type="text" id="user_id" name="user_id" required></input>
                            <label htmlFor="name">From:</label>
                            <input type="date" id="date_input1" name="date_input1" required/>
                            <label htmlFor="name">To:</label>
                            <input type="date" id="date_input2" name="date_input2" required/>
                            <input type="submit" id="display" name="display" value="Display"/>
                            <input type="submit" value="Export Data" onClick={dataExportUser}/>
                            <input type="submit" value="Export Entire Database" onClick={dataExportAll}/>
                        </div>
                    </form>
                    <form onSubmit={DisplayPackageData}>
                        <div className='dateInput'>
                            <label htmlFor="package_id">Package ID:</label>
                            <input type="text" id="package_id" name="package_id" required></input>
                            <input type="submit" id="display" name="display" value="Display"/>
                        </div>
                    </form>
                    {listOfPackages.map((package_data) => {
                        return <div>
                            <h1>Item ID: {package_data.item_id}</h1>
                            <h2>Client ID: {package_data.client_id}</h2>
                            <h2>Status: {package_data.status}</h2>
                            <h2>Date: {package_data.date}</h2>
                            <h2>Storage ID: {package_data.storage_id}</h2>
                            <h2>Current coordinates: {package_data.location.coordinates}</h2>
                            <h2>Distance to destination: {package_data.dist_in_km} km</h2>
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
