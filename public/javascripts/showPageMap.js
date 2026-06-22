// Wait for DOM and SDK to be ready
function initializeShowMap() {
    // Validate prerequisites
    if (typeof maptilersdk === 'undefined') {
        console.error('MapTiler SDK is not loaded');
        return;
    }

    if (!maptilerApiKey) {
        console.error('MapTiler API key is not set');
        return;
    }

    if (!campground || !campground.geometry) {
        console.error('Campground data is not available');
        return;
    }

    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found in DOM');
        return;
    }

    maptilersdk.config.apiKey = maptilerApiKey;

    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.BRIGHT,
        center: campground.geometry.coordinates, // starting position [lng, lat]
        zoom: 10 // starting zoom
    });

    new maptilersdk.Marker()
        .setLngLat(campground.geometry.coordinates)
        .setPopup(
            new maptilersdk.Popup({ offset: 25 })
                .setHTML(
                    `<h3>${campground.title}</h3><p>${campground.location}</p>`
                )
        )
        .addTo(map);
}

// Execute when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShowMap);
} else {
    initializeShowMap();
}