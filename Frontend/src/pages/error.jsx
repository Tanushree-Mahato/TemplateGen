import React from 'react';
import { Link } from 'react-router-dom';

function Error() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ fontSize: '20px', textDecoration: 'underline' }}>
        Go to Home
      </Link>
    </div>
  );
}

export default Error;
