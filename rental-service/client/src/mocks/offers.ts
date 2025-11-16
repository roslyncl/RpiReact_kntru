import { FullOffer } from '../types/offer';

export const offers: FullOffer[] = [
  {
    id: '1',
    title: 'Beautiful & luxurious apartment at great location',
    type: 'apartment',
    price: 120,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    description: 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam.',
    bedrooms: 3,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Baby seat',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge'
    ],
    host: {
      name: 'Oliver Conner',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
    images: [
      'img/apartment-01.jpg',
      'img/apartment-02.jpg',
      'img/apartment-03.jpg',
      'img/room.jpg'
    ],
    maxAdults: 4
  },
  {
    id: '2',
    title: 'Wood and stone place',
    type: 'room',
    price: 80,
    city: {
      name: 'Amsterdam',
      location: {
        latitude: 52.37454,
        longitude: 4.897976,
        zoom: 13
      }
    },
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 16
    },
    isFavorite: false,
    isPremium: false,
    rating: 4.2,
    description: 'This is a place for dreamers to reset, reflect, and create. Designed with a "slow" pace in mind.',
    bedrooms: 1,
    goods: [
      'Wi-Fi',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Fridge'
    ],
    host: {
      name: 'Angelina',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
    images: [
      'img/room.jpg',
      'img/apartment-02.jpg'
    ],
    maxAdults: 2
  },
  {
    id: '3',
    title: 'Canal View Prinsengracht',
    type: 'apartment',
    price: 132,
    city: {
      name: 'Cologne',
      location: {
        latitude: 50.938361,
        longitude: 6.959974,
        zoom: 13
      }
    },
    location: {
      latitude: 50.938361,
      longitude: 6.959974,
      zoom: 16
    },
    isFavorite: true,
    isPremium: true,
    rating: 4.9,
    description: 'Relax, rejuvenate and unplug in this ultimate rustic getaway experience in the country.',
    bedrooms: 4,
    goods: [
      'Wi-Fi',
      'Washing machine',
      'Towels',
      'Heating',
      'Coffee machine',
      'Kitchen',
      'Dishwasher',
      'Cabel TV',
      'Fridge',
      'Baby seat',
      'Parking'
    ],
    host: {
      name: 'Max',
      avatarUrl: 'img/avatar-max.jpg',
      isPro: false
    },
    images: [
      'img/apartment-03.jpg',
      'img/apartment-01.jpg'
    ],
    maxAdults: 6
  },
  {
    id: '4',
    title: 'Nice, cozy, warm big bed apartment',
    type: 'house',
    price: 180,
    city: {
      name: 'Brussels',
      location: {
        latitude: 50.846557,
        longitude: 4.351697,
        zoom: 13
      }
    },
    location: {
      latitude: 50.846557,
      longitude: 4.351697,
      zoom: 16
    },
    isFavorite: false,
    isPremium: false,
    rating: 3.8,
    description: 'Discover the beauty of the region with activities like skiing, hiking, and mountain biking.',
    bedrooms: 2,
    goods: [
      'Wi-Fi',
      'Heating',
      'Kitchen',
      'Fridge',
      'Parking'
    ],
    host: {
      name: 'Sarah',
      avatarUrl: 'img/avatar-angelina.jpg',
      isPro: true
    },
    images: [
      'img/apartment-02.jpg',
      'img/apartment-03.jpg'
    ],
    maxAdults: 3
  }
];