import {JSX} from 'react';
import { Logo } from "../../components/logo/logo";
import { Link } from 'react-router-dom';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page" style={{textAlign: 'center', padding: '50px'}}>
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <Logo />
            </div>
          </div>
        </div>
      </header>
      
      <main style={{flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div>
          <h1>404</h1>
          <p>Page not found</p>
          <Link to="/" className="button">Go to Main Page</Link>
        </div>
      </main>
    </div>
  );
}

export { NotFoundPage };