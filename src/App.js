import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ListingsContainer from './components/ListingsContainer'
import MapComponent from './components/MapComponent';
import listingsData from './sample.json';
import SearchBar from './components/SearchBar'


const App = () => {
  return (
<>
<div className='search-container'>
        <SearchBar />
      </div>
      <div className="listings-and-map">

          <ListingsContainer />
        <div className='map-container'>
          <MapComponent listings={listingsData.listings} />
        </div>
    </div>
</>
  );
};

export default App;
