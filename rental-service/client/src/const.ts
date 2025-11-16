const Setting ={
    rentalOffersCount: 312,
} as const;

const AppRoute = {
    Main : '/',
    Login : '/login',
    Favorites : '/favorites',
    Offer : '/offer',
} as const;

const AuthorizationStatus = {
    Auth: 'AUTH',
    NoAuth: 'NO_AUTH',
    Unknown: 'UNKNOWN',
} as const;

export { Setting, AppRoute, AuthorizationStatus };