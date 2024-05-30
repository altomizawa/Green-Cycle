import './Maps.css';
import { React, useState } from 'react';

import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

function Maps() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyAR8MnZUPqxn04n5tCtWYMwU_UjLpDWnWo',
  });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedMarkerAddress, setSelectedMarkerAddress] = useState(null);
  const markers = [
    { lat: -23.586206, lng: -46.632914 },
    { lat: -23.590631, lng: -46.638272 },
    { lat: -23.590392, lng: -46.630073 },
    { lat: -23.588098, lng: -46.636687 },
    { lat: -23.590205, lng: -46.634277 },
    { lat: -23.589079, lng: -46.631787 },
    { lat: -23.58595, lng: -46.631717 },
    { lat: -23.588548, lng: -46.636085 },
    { lat: -23.590579, lng: -46.635285 },
    { lat: -23.587079, lng: -46.635785 },
  ];

  const onMarkerClick = async (marker) => {
    setSelectedMarker(marker);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${marker.lat},${marker.lng}&key=AIzaSyAR8MnZUPqxn04n5tCtWYMwU_UjLpDWnWo`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSelectedMarkerAddress(data.results[0].formatted_address);
      } else {
        setSelectedMarkerAddress('Endereço não encontrado');
      }
    } catch (error) {
      console.error('Erro ao obter o endereço:', error);
      setSelectedMarkerAddress('Erro ao obter o endereço');
    }
  };

  const onCloseInfoWindow = () => {
    setSelectedMarker(null);
    setSelectedMarkerAddress(null);
  };

  const position = { lat: -23.587, lng: -46.635 };
  return (
    <div className='maps__container'>
      <div className='maps__info'>
        <div className='maps__text'>
          <h1 className='maps__title'>Pontos de coleta</h1>
          <img src='./assets/marker.svg' alt='ícone de marcação' />
        </div>
        <h3 className='maps__subtitle'>
          Encontre um ponto de coleta perto de você:
        </h3>
      </div>
      <div className='maps'>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={position}
            zoom={18}
          >
            {markers.map((marker, index) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: `http://maps.google.com/mapfiles/ms/icons/green-dot.png`,
                }}
                onClick={() => onMarkerClick(marker)}
              />
            ))}
            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={onCloseInfoWindow}
              >
                <div>
                  <h2>Endereço:</h2>
                  <p>{selectedMarkerAddress}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Maps;