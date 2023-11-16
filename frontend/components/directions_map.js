import React, { useState, useCallback, memo } from 'react';
import { GoogleMap, useJsApiLoader, MarkerClusterer, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
    width: '600px',
    height: '400px'
};

const initialPos = {
    lat: -25.819086,
    lng: 132.508993
};

/**
* @desc Main export for the itinerary map component
*/
function ItineraryMap({selectedMarkers, childToParent, optimalActive, isGenerated}) {
    
    const markers = selectedMarkers;

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDkjfCcoLsAdEns2kx16F8tYeuelENSTCc"
    })

    const [map, setMap] = useState(null);
    const [directions, setDirections] = useState(null);
    const [index, setIndex] = useState(null);

    const onLoad = useCallback(function callback(map) {
        if (markers.length != 0) {
            const bounds = new window.google.maps.LatLngBounds();
            for (let i = 0; i < markers.length; i++) {
                bounds.extend(markers[i]['position'])
            }
            map.fitBounds(bounds)
        }
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    if (selectedMarkers.length > 1) {
        if (index == null) {
            fetchFurthestMarker()
                .then(function(result) {
                    setIndex(result);
                });
        };

        if (directions == null && index != null && !isGenerated) {
            fetchDirections(index);
        } else if (optimalActive == 0 && !isGenerated) {
            fetchDirections(selectedMarkers.length - 1);
        };
    }

    /**
    * @desc Fetches directions / route to display through the Google Maps Directions API
    *       Origin is automatically set to be the first marker selected
    *       Intermediate points are optimised (shortest path) through the directions service call
    */
    function fetchDirections(destinationIndex) {
        var reSelectedMarkers = [];
        var waypoints = [];
        var waypoint;
        var optimalDuration = 0;
        var optBool = true;

        if (optimalActive == 0) {
            optBool = false;
        }

        if (selectedMarkers.length > 2) {
            for (let i = 1; i < (selectedMarkers.length); i++) {
                if (i != destinationIndex) {
                    waypoint = {
                        'location': {'placeId': selectedMarkers[i]['place_id']},
                        'stopover': true
                    };
                    waypoints.push(waypoint);
                }
            }
        }

        const service = new google.maps.DirectionsService();
        service.route(
            {
              origin: {'placeId': selectedMarkers[0]['place_id']},
              destination: {'placeId': selectedMarkers[destinationIndex]['place_id']},
              waypoints: waypoints,
              optimizeWaypoints: optBool,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK" && result) {
                setDirections(result);
                for (let i = 0; i < (selectedMarkers.length - 1); i++) {
                    optimalDuration += result['routes'][0]['legs'][i]['duration']['value'] + 1800
                };
                if (optimalActive == 1) {
                    reSelectedMarkers.push(selectedMarkers[0]);
                    for (let i = 0; i < (selectedMarkers.length - 1); i++) {
                        for (let j = 1; j < (selectedMarkers.length); j++) {
                            if ((selectedMarkers[j]['address'] === (result['routes'][0]['legs'][i]['end_address']))) {
                                reSelectedMarkers.push(selectedMarkers[j]);
                            }
                        };
                    };
                    childToParent(optimalDuration, reSelectedMarkers, result['routes'][0]['legs']);
                } else {
                    childToParent(optimalDuration, selectedMarkers, result['routes'][0]['legs']);
                }
              }
            }
        );
    };

    /**
    * @desc Fetches the furthest marker from the origin (distance based) through the Google Maps Distance Matrix API
    */
    async function fetchFurthestMarker() {
        
        var destinations = [];
        var maxIndex = 1;

        for (let i = 1; i < (selectedMarkers.length); i++) {
            destinations.push({'placeId': selectedMarkers[i]['place_id']});
        }

        var service = new google.maps.DistanceMatrixService();
        let promise = new Promise(function(resolve, reject) {
            service.getDistanceMatrix(
            {
                origins: [{'placeId': selectedMarkers[0]['place_id']}],
                destinations: destinations,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            function(result, status) {
                if (status === "OK" && result) {  
                    var maxDist = result['rows'][0]['elements'][0]['distance']['value'];

                    for (let i = 0; i < (destinations.length); i++) {
                        if (result['rows'][0]['elements'][i]['distance']['value'] > maxDist) {
                            maxDist = result['rows'][0]['elements'][i]['distance']['value'];
                            maxIndex = i + 1;
                        }
                    }
                    resolve(maxIndex);
                } else {
                    reject(alert('Error'));
                }
            });   
        });
        return await promise;
    }

    const options = {
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [{
            'featureType': 'poi',
                'stylers': [{
                'visibility': 'off'
            }]
        }, {
            'featureType': 'landscape',
                'stylers': [{
                'visibility': 'off'
            }]
        }, {
            'featureType': 'transit',
                'stylers': [{
                'visibility': 'off'
            }]
        }]
    };

    if (!isLoaded) return <div>Loading...</div>;
    
    return (
    <>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={initialPos}
            zoom={3}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
        > 
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: true,
                        polylineOptions: {
                        zIndex: 50,
                        strokeColor: "#1976D2",
                        strokeWeight: 5
                        },
                    }}
                />
            )}

            {<MarkerClusterer>
                { (clusterer, icon) =>
                    markers.map(({id, position}) => (
                        <Marker
                            key={id}
                            position={position}
                            clusterer={clusterer}
                            icon = 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png'
                        ></Marker>
                    ))
                }
            </MarkerClusterer>
            }
        </GoogleMap>
    </>
  );
}

export default memo(ItineraryMap)
