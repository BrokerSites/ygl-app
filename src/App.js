import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingsContainer from './components/ListingsContainer'
import MapComponent from './components/MapComponent';
import listingsData from './sample.json';


const App = () => {
  return (
    <div className="listings-and-map">
      <ListingsContainer />
      <MapComponent listings={listingsData.listings} />
    </div>
  );
};

export default App;
