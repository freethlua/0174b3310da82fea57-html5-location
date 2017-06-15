const fs = require('fs');
const cities = require('all-the-cities');

fs.writeFileSync('cities.json', JSON.stringify(cities
  .filter(city => city.country === 'US')
  // .map(city => ({
  //   name: city.name,
  //   lat: city.lat,
  //   lng: city.lon,
  // }))
));
