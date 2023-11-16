import React, { useState, useCallback, memo } from 'react'
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
* @desc Main export for the property map (schedule) component
*/
function PropertyMap({addressData, childToParent, selectedDay, isGenerated}) {

    const markers = addressData;
    const redArr = [];
    const greenArr = [];
    const whiteArr = [];

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyDkjfCcoLsAdEns2kx16F8tYeuelENSTCc"
    })

    const [map, setMap] = useState(null);
    const [directions, setDirections] = useState(null);

    const [redMarkers, setRedMarkers] = useState(null);
    const [greenMarkers, setGreenMarkers] = useState(null);
    const [whiteMarkers, setWhiteMarkers] = useState(null);

    const [day, setDay] = useState(null);

    if (redMarkers == null || day != selectedDay) {
        for (let i = 0; i < markers.length; i++) {
            if (markers[i]['status'] === 'Scheduled') {
                markers.splice(i, 1);
                i = i - 1;
            } else if (markers[i]['status'] === 'Not Due') {
                markers.splice(i, 1);
                i = i - 1;
            }
        }

        for (let i = 0; i < markers.length; i++) {
            if (markers[i]['status'] === 'Urgent') {
                redArr.push(markers[i]);
            } else if (markers[i]['preferences'][selectedDay] == 1) {
                greenArr.push(markers[i]);
            } else {
                whiteArr.push(markers[i]);
            }
        }

        for (let i = 0; i < redArr.length; i++) {
            redArr[i]['index'] = i;
        }

        for (let i = 0; i < greenArr.length; i++) {
            greenArr[i]['index'] = i;
        }

        for (let i = 0; i < whiteArr.length; i++) { 
            whiteArr[i]['index'] = i;
        } 

        setRedMarkers(redArr)
        setGreenMarkers(greenArr)
        setWhiteMarkers(whiteArr)
        setDay(selectedDay)
    }

    const onLoad = useCallback(function callback(map) {
        if (markers.length != 0) {
            const bounds = new window.google.maps.LatLngBounds();
            for (let i = 0; i < markers.length; i++) {
                bounds.extend(markers[i]['position'])
            }
            map.fitBounds(bounds);
        }
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

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
                    redMarkers.map(({id, position, index}) => (
                        <Marker
                            key={id}
                            position={position}
                            clusterer={clusterer}
                            icon = 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
                            onClick={() => {   
                                childToParent(redMarkers[index])
                            }}
                        ></Marker>
                    ))
                }
            </MarkerClusterer>}
            
            {<MarkerClusterer>
                { (clusterer, icon) =>
                    greenMarkers.map(({id, position, index}) => (
                        <Marker
                            key={id}
                            position={position}
                            clusterer={clusterer}
                            icon = 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            onClick={() => {   
                                childToParent(greenMarkers[index])
                            }}
                        ></Marker>
                    ))
                }
            </MarkerClusterer>}

            {<MarkerClusterer>
                { (clusterer, icon) =>
                    whiteMarkers.map(({id, position, index}) => (
                        <Marker
                            key={id}
                            position={position}
                            clusterer={clusterer}
                            icon = 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                            onClick={() => {   
                                childToParent(whiteMarkers[index])
                            }}
                        ></Marker>
                    ))
                }
            </MarkerClusterer>}
        </GoogleMap>
    </>
  );
}

export default memo(PropertyMap)