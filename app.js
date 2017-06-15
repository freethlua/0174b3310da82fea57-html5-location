import { Component, render } from 'preact';
import linkstate from 'linkstate';
import h from 'preact-hyperscript-h';
import GoogleMapsLoader from 'google-maps';

GoogleMapsLoader.KEY = 'AIzaSyA0AAwbeF9ZEqD5eOa6hiFzB0N7Uiu6uV8';
GoogleMapsLoader.LIBRARIES = ['places'];
let google;

class App extends Component {

  creatNewMap(latLng) {
    this.currentPosition = latLng
      || new google.maps.LatLng(-25.363, 131.044);
      // || new google.maps.LatLng(28.7091, 77.112);
    console.log(`this.currentPosition:`, {
      lat: this.currentPosition.lat(),
      lng: this.currentPosition.lng(),
    });

    this.map = new google.maps.Map(this.ref, {
      center: this.currentPosition,
      zoom: 4,
    });
    this.marker = new google.maps.Marker({
      position: this.currentPosition,
      map: this.map,
    });
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.placesService.nearbySearch({
      // this.placesService.radarSearch({
      location: this.currentPosition,
      // radius: 50000,
      type: 'administrative_area_level_1',
      // types: ['city'],
      rankBy: google.maps.places.RankBy.DISTANCE,
    }, (places, status) => {
      this.setState({ places });
      // this.setState({ places: places.map(p => p.name) });
    });

  }

  componentDidMount() {
    this.creatNewMap();
    navigator.geolocation.getCurrentPosition(
      position => this.creatNewMap(
        new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
      )
    );
  }
  render() {
    return h.div([
      h.form({
        onsubmit: e => {
          e.preventDefault();
        }
      }, [
        h.input({
          placeholder: 'Enter location',
          onchange: linkstate(this, 'input'),
        })
      ]),
      h.pre(JSON.stringify(this.state.places, null, 2)),
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
