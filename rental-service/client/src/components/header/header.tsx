import { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../logo/logo';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logoutAction } from '../../store/api-action';

const getAvatarUrl = (avatarPath: string | null | undefined): string => {
  if (!avatarPath) return '/img/avatar.svg';
  if (avatarPath.startsWith('http')) return avatarPath;
  return `http://localhost:5000${avatarPath}`;
};

function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector((state) => state.authorizationStatus);
  const user = useAppSelector((state) => state.user);
  const favoriteCount = useAppSelector((state) => state.favoriteOffers?.length || 0);

  const isAuthorized = authorizationStatus === AuthorizationStatus.Auth;

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate(AppRoute.Main);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__wrapper">
          <div className="header__left">
            <Logo />
          </div>
          <nav className="header__nav">
            <ul className="header__nav-list">
              {isAuthorized ? (
                <>
                  <li className="header__nav-item user">
                    <Link
                      className="header__nav-link header__nav-link--profile"
                      to={AppRoute.Favorites}
                    >
                      <div className="header__avatar-wrapper user__avatar-wrapper">
                        <img
                          className="header__avatar user__avatar"
                          src={getAvatarUrl(user?.avatar)}
                          width="20"
                          height="20"
                          alt="User avatar"
                        />
                      </div>
                      <span className="header__user-name user__name">
                        {user?.username || 'User'} 
                      </span>
                      <span className="header__favorite-count">{favoriteCount}</span>
                    </Link>
                  </li>
                  <li className="header__nav-item">
                    <Link
                      className="header__nav-link"
                      to="#"
                      onClick={handleLogout}
                    >
                      <span className="header__signout">Sign out</span>
                    </Link>
                  </li>
                </>
              ) : (
                <li className="header__nav-item user">
                  <Link
                    className="header__nav-link header__nav-link--profile"
                    to={AppRoute.Login}
                  >
                    <div className="header__avatar-wrapper user__avatar-wrapper"></div>
                    <span className="header__login">Sign in</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export { Header };