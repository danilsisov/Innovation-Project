import NavigationBar from './components/navigationBar.js';
import './components/css/App.css';
import ReactMap from "./components/map.js";
import Data from "./components/data.js";

function App() {
  return (
    <div className="App">
      <NavigationBar/>
      <ReactMap/>
      <Data/>
    </div>
  );
}

export default App;
