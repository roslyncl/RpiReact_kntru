import React, { JSX, useRef, useEffect } from 'react';
import leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useMap from './useMap';
import { URL_MARKER_DEFAULT, URL_MARKER_CURRENT } from '../../const';
import { OfferList, CityOffer } from '../../types/offer';

type MapProps = {
  city: CityOffer | undefined;
  points: OfferList[];
  selectedPoint: OfferList | null;
};

function Map({ city, points, selectedPoint }: MapProps): JSX.Element {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapRef, city);

  const defaultCustomIcon = leaflet.icon({
    iconUrl: URL_MARKER_DEFAULT,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const currentCustomIcon = leaflet.icon({
    iconUrl: URL_MARKER_CURRENT,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  useEffect(() => {
    if (map) {
      const markerGroup = leaflet.layerGroup().addTo(map);
      
      points.forEach((point) => {
        leaflet
          .marker({
            lat: point.location.latitude,
            lng: point.location.longitude,
          }, {
            icon: selectedPoint && point.id === selectedPoint.id
              ? currentCustomIcon
              : defaultCustomIcon,
          })
          .addTo(markerGroup);
      });

      return () => {
        if (map) {
          map.removeLayer(markerGroup);
        }
      };
    }
  }, [map, points, selectedPoint, defaultCustomIcon, currentCustomIcon]);

  if (!city) {
    return <div className="cities__map map" ref={mapRef} style={{ height: '100%' }}></div>;
  }

  return (
    <div
      className="cities__map map"
      ref={mapRef}
      style={{ height: '100%' }}
    >
    </div>
  );
}

export { Map };