import { Review } from "../types/review";

export const reviews: Review[] = [ 
  {
    'id': '1',
    'comment': 'A quiet cozy and picturesque that hides behind a a river by the unique lightness of Amsterdam. The building is green and from 18th century.',
    'date': '2023-06-29T21:00:00.465Z',
    'rating': 4,
    'user': {
      'name': 'Max',
      'avatarUrl': '/img/avatar-max.jpg',
      'isPro': true
    }
  },
  {
    'id': '2',
    'comment': 'Great location and very comfortable apartment. Would definitely stay here again!',
    'date': '2024-01-15T14:30:00.465Z',
    'rating': 5,
    'user': {
      'name': 'Anna',
      'avatarUrl': '/img/avatar-angelina.jpg',
      'isPro': false
    }
  },
  {
    'id': '3',
    'comment': 'Nice place but the wifi connection was a bit slow in the evenings.',
    'date': '2023-12-10T09:15:00.465Z',
    'rating': 3,
    'user': {
      'name': 'John',
      'avatarUrl': '/img/avatar.jpg',
      'isPro': true
    }
  }
];