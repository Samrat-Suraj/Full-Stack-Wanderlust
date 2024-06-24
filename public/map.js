mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : 'mapbox://styles/mapbox/streets-v12',
    center: listings.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listings.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h4>${listings.location}</h4><p>Exact location Provide After Bookings</p>`))
    .addTo(map);

console.log(coordinates)