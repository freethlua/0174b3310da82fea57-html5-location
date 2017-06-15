import { Component, render } from 'preact';
import linkstate from 'linkstate';
import debounce from 'debounce';
import h from 'preact-hyperscript-h';
import GoogleMapsLoader from 'google-maps';
import distance from 'gps-distance';
import cities from './cities';

GoogleMapsLoader.KEY = 'AIzaSyA0AAwbeF9ZEqD5eOa6hiFzB0N7Uiu6uV8';
GoogleMapsLoader.LIBRARIES = ['places'];
let google;

class App extends Component {

  componentWillMount() {
    this.creatNewMap = debounce(this.creatNewMap, 100, true);
  }

  creatNewMap(latLng) {
    this.currentPosition =
      latLng
      // || new google.maps.LatLng(-25.363, 131.044);
      || new google.maps.LatLng(41.66809125898663, -70.29797652039338);
    // || new google.maps.LatLng(28.7091, 77.112);
    // console.log(`this.currentPosition:`, {
    //   lat: this.currentPosition.lat(),
    //   lng: this.currentPosition.lng(),
    // });

    const lat = this.currentPosition.lat();
    const lng = this.currentPosition.lng();

    this.map = new google.maps.Map(this.ref, {
      center: this.currentPosition,
      zoom: 4,
    });
    this.marker = new google.maps.Marker({
      position: this.currentPosition,
      map: this.map,
    });

    const citiesByDistance = cities.sort((a, b) => {
      const aDiff = distance(lat, lng, a.lat, a.lon);
      const bDiff = distance(lat, lng, b.lat, b.lon);
      return aDiff === bDiff ? 0
        : aDiff > bDiff ? 1 : -1;
    });
    const ofInterest = citiesByDistance
      .filter(c => c.featureCode === 'PPLA')
      .slice(0, 3)
    // .map(c => [c.name, distance(lat, lng, c.lat, c.lon)]);
    this.setState({ customData: ofInterest })
    // console.log();
    // for (const city of cities) {
    //   if (nearest)
    // }

    ofInterest.forEach(c => new google.maps.Marker({
      position: new google.maps.LatLng(c.lat, c.lon),
      map: this.map,
    }))

    this.placesService = new google.maps.places.PlacesService(this.map);
    this.placesService.nearbySearch({
      // this.placesService.radarSearch({
      location: this.currentPosition,
      // radius: 50000,
      // type: 'city',
      type: 'administrative_area_level_1',
      // types: ['city'],
      rankBy: google.maps.places.RankBy.DISTANCE,
    }, (places, status) => {
      this.setState({ googleMapsNearbySearch: places });
      // this.setState({ places: places.map(p => p.name) });
    });



  }

  detectLocation() {
    navigator.geolocation.getCurrentPosition(
      position => this.creatNewMap(
        new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
      )
    );
  }

  componentDidMount() {
    this.creatNewMap();
  }
  render() {
    return h.div([
      h.button({ onclick: e => this.detectLocation() }, 'Detect Location'),
      // h.form({
      //   onsubmit: e => {
      //     e.preventDefault();
      //   }
      // }, [
      //   h.input({
      //     placeholder: 'Enter location',
      //     onchange: linkstate(this, 'input'),
      //   })
      // ]),
      h.pre(JSON.stringify(this.state, null, 2)),
      h.div({
        ref: ref => this.ref = ref,
        style: {
          // position: 'fixed',
          width: '100%',
          height: '90vh',
        }
      }),
    ]);
  }
}

GoogleMapsLoader.load(_ => {
  google = _;
  render(h(App), document.body)
});
