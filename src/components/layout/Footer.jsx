import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <footer className="bg-[#181818] text-[#F8F6F2] pt-20 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Editorial Brand Story */}
        <div className="space-y-6 md:col-span-1">
          <span className="font-serif text-2xl tracking-[0.25em] font-light block">ETNIKO</span>
          <p className="text-[11px] font-sans leading-relaxed text-neutral-400 text-justify">
            ETNIKO is an architectural tribute to the art of ethnic drapes. Founded in Hyderabad by designer Niharika, our studio creates body-inclusive, customizable handloom garments woven with heritage zari details and a deep commitment to Indian artisan preservation.
          </p>
          <div className="flex space-x-4 pt-2">
            {['Instagram', 'Pinterest', 'WhatsApp', 'Facebook'].map(social => (
              <a
                key={social}
                href="#"
                className="text-[9px] uppercase tracking-widest text-[#D9C7A3] hover:text-white transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Collection Links */}
        <div className="space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] font-sans font-semibold uppercase text-[#D9C7A3]">COLLECTIONS</h4>
          <ul className="space-y-2.5 text-xs font-sans text-neutral-400">
            <li>
              <Link to="/shop?category=WOMEN" className="hover:text-white transition-colors">Women's Pre-Draped Sarees</Link>
            </li>
            <li>
              <Link to="/shop?category=WOMEN&sub=Lehengas" className="hover:text-white transition-colors">Bridal Lehengas</Link>
            </li>
            <li>
              <Link to="/shop?category=MEN" className="hover:text-white transition-colors">Men's Handloom Kurtas</Link>
            </li>
            <li>
              <Link to="/shop?category=KIDS" className="hover:text-white transition-colors">Festive Kids Couture</Link>
            </li>
            <li>
              <Link to="/customize" className="hover:text-white transition-colors">Bespoke Custom Designing</Link>
            </li>
          </ul>
        </div>

        {/* Boutique Location & Hours */}
        <div className="space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] font-sans font-semibold uppercase text-[#D9C7A3]">FLAGSHIP STUDIO</h4>
          <div className="space-y-3.5 text-xs font-sans text-neutral-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D9C7A3] shrink-0 mt-0.5" />
              <span>Plot 540, Road No. 36, Jubilee Hills, Near Metro Station, Hyderabad, Telangana, 500033</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D9C7A3] shrink-0" />
              <span>+91 98300 12345 / +91 40 4567 8910</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-[#D9C7A3] shrink-0 mt-0.5" />
              <div>
                <p>11:00 AM – 8:00 PM (IST)</p>
                <p className="text-[10px] text-[#D9C7A3]">Open All Seven Days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="text-[10px] tracking-[0.25em] font-sans font-semibold uppercase text-[#D9C7A3]">THE STUDIO JOURNAL</h4>
          <p className="text-[11px] font-sans leading-relaxed text-neutral-400">
            Subscribe to receive invitations to private studio collections previews, custom fabric arrivals, and designer trunk shows.
          </p>
          <form onSubmit={handleSubscribe} className="relative mt-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              required
              className="w-full bg-transparent border-b border-neutral-700 py-2.5 pr-10 text-xs font-sans tracking-wider text-white placeholder-neutral-500 focus:outline-none focus:border-[#D9C7A3] transition-colors"
            />
            <button
              type="submit"
              className="absolute right-0 top-1.5 p-1 text-[#D9C7A3] hover:text-white transition-colors"
              aria-label="Subscribe to newsletter"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {submitted && (
            <p className="text-[9px] uppercase tracking-widest text-[#3E7C59] animate-pulse mt-2">
              Welcome to the inner circle.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between text-[10px] font-sans tracking-widest text-neutral-500 gap-4">
        <div>
          <span>© 2026 ETNIKO DESIGNER STUDIO. ALL RIGHTS RESERVED.</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-neutral-300">PRIVACY POLICY</a>
          <a href="#" className="hover:text-neutral-300">TERMS & CONDITIONS</a>
          <Link to="/admin" className="hover:text-neutral-300">ADMIN CONTROL</Link>
        </div>
      </div>
    </footer>
  );
}
