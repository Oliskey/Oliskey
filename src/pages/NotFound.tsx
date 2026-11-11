import React from 'react';
import { Link } from 'react-router-dom';
import { PageTop } from '../components/Section';

const NotFound: React.FC = () => (
  <PageTop>
    <div className="min-h-[50svh]">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-3 text-title text-ink">This room doesn’t exist.</h1>
      <p className="mt-4 text-lead text-muted">The page may have moved. Head back to the lobby.</p>
      <Link to="/" className="btn-primary mt-8">Go to the homepage</Link>
    </div>
  </PageTop>
);
export default NotFound;
