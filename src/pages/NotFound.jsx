import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="pb-24 pt-40">
      <div className="wrap max-w-2xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="display mt-4 text-6xl sm:text-7xl">This page took a wrong turn</h1>
        <p className="lede mt-4">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-dark">Home</Link>
          <Link to="/book-now/" className="btn-primary">Book a ride</Link>
          <Link to="/schedule/" className="btn-ghost">Prices</Link>
        </div>
      </div>
    </section>
  );
}
