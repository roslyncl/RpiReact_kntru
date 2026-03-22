import {JSX} from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/header/header';

function NotFoundPage(): JSX.Element {
  return (
    <div className="page" style={{textAlign: 'center', padding: '50px'}}>
      <Header /> 
      
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