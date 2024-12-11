import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            Rankify
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="#features" className="text-muted hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#pricing" className="text-muted hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link to="#about" className="text-muted hover:text-foreground transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;