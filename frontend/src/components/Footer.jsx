import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 text-sm text-slate-500 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
      <div className="space-y-4">
        <img src={assets.logo} alt="CarRental" className="h-8" />
        <p className="text-sm text-slate-500">
          Premium car rental service with a wide selection of luxury and
          everyday vehicles for all your driving needs.
        </p>
        <div className="flex items-center gap-3">
          <img src={assets.facebook_logo} alt="Facebook" className="h-4 w-4" />
          <img src={assets.instagram_logo} alt="Instagram" className="h-4 w-4" />
          <img src={assets.twitter_logo} alt="Twitter" className="h-4 w-4" />
          <img src={assets.gmail_logo} alt="Email" className="h-4 w-4" />
        </div>
      </div>
     <div className="space-y-3 ml-24">
        <p className="text-xs font-semibold uppercase text-slate-400">
          Quick Links
        </p>
        <Link to="/" className="block text-slate-500 hover:text-slate-700">
          Home
        </Link>
        <Link to="/cars" className="block text-slate-500 hover:text-slate-700">
          Browse Cars
        </Link>
        <Link
          to="/owner/add-car"
          className="block text-slate-500 hover:text-slate-700"
        >
          List Your Car
        </Link>
        <span className="block text-slate-500">About Us</span>
      </div>

      <div className="space-y-3 ml-24">
        <p className="text-xs font-semibold uppercase text-slate-400">
          Resources
        </p>
        <span className="block text-slate-500">Help Center</span>
        <span className="block text-slate-500">Terms of Service</span>
        <span className="block text-slate-500">Privacy Policy</span>
        <span className="block text-slate-500">Insurance</span>
      </div>

      <div className="space-y-3 ml-24">
        <p className="text-xs font-semibold uppercase text-slate-400">
          Contact
        </p>
        <span className="block text-slate-500">1234 Luxury Drive</span>
        <span className="block text-slate-500">San Francisco, CA 94107</span>
        <span className="block text-slate-500">+1 234 567890</span>
        <span className="block text-slate-500">info@example.com</span>
      </div>     
    </div>

    <div className="border-t border-slate-200 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <span>© 2026 Brand. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Privacy</span>
          <span>|</span>
          <span>Terms</span>
          <span>|</span>
          <span>Cookies</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
