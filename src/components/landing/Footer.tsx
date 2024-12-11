import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-sm leading-loose text-muted md:text-left">
          © 2024 Rankify. Helping Local Businesses Thrive One Customer at a Time.
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/about" className="text-muted hover:text-foreground">
            About
          </Link>
          <Link to="/features" className="text-muted hover:text-foreground">
            Features
          </Link>
          <Link to="/contact" className="text-muted hover:text-foreground">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
};