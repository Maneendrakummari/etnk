import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';

import menSherwaniSun from '../../assets/men_sherwani_sun.png';
import womenMaroonLehenga from '../../assets/women_maroon_lehenga.png';
import kidsEthnicWear from '../../assets/kids_ethnic_wear.png';
import coupleWeddingIvory from '../../assets/couple_wedding_ivory.png';

// Place logo asset path here once available (e.g. logo.svg or logo.png)
const logoAsset = null;

export default function Navbar({ onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { pathname } = useLocation();
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { openSearch } = useSearch();

  // Preserved logic for contexts
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowMegaMenu(false);
  }, [pathname]);

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'LOOK & SHOP', path: '/look-and-shop' },
    { label: 'SHOP', path: '/shop' },
    { label: 'CUSTOMISE', path: '/customize' },
    { label: 'ABOUT', path: '/about' },
    { label: 'CONTACT', path: '/contact' }
  ];

  return (
    <>
      <header 
        className="w-full bg-[#F8F6F2] dark:bg-[#181818] border-b border-[#ECECEC] dark:border-neutral-800 text-[#181818] dark:text-[#F8F6F2] sticky top-0 z-40 transition-colors"
        onMouseLeave={() => setShowMegaMenu(false)}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center relative">
          
          {/* MOBILE HEADER (md:hidden) */}
          <div className="w-full h-16 flex md:hidden items-center justify-between">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 focus:outline-none hover:text-[#B68D40]"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Centered Mobile Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              {logoAsset ? (
                <Link to="/">
                  <img src={logoAsset} alt="ETNIKO Designer Boutique" className="h-7 w-auto object-contain" />
                </Link>
              ) : (
                <Link to="/" className="flex flex-col items-center">
                  <span className="font-serif text-lg tracking-[0.2em] font-light leading-none">ETNIKO</span>
                  <span className="text-[5.5px] tracking-[0.3em] uppercase font-sans mt-1 text-[#B68D40] font-bold">
                    - DESIGNER BOUTIQUE -
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile Actions Drawer trigger */}
            <button
              onClick={onOpenCart}
              className="p-2 -mr-2 focus:outline-none hover:text-[#B68D40] relative"
              aria-label="Open cart mobile"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#B68D40] text-white text-[7px] font-sans font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* DESKTOP ROW 1: Centered Logo + Right Action Icons */}
          <div className="hidden md:flex w-full items-center justify-between pt-8 pb-5 relative">
            {/* Left Spacer to balance icons width */}
            <div className="w-44" />

            {/* Centered Logo */}
            <div className="absolute left-1/2 -translate-x-1/2">
              {logoAsset ? (
                <Link to="/">
                  <img src={logoAsset} alt="ETNIKO Designer Boutique" className="h-10 w-auto object-contain" />
                </Link>
              ) : (
                <Link to="/" className="flex flex-col items-center select-none text-center transform hover:scale-[1.01] transition-transform">
                  <span className="font-serif text-3xl tracking-[0.25em] font-light leading-none">ETNIKO</span>
                  <span className="text-[7.5px] tracking-[0.35em] uppercase font-sans mt-2 text-[#B68D40] font-bold">
                    - DESIGNER BOUTIQUE -
                  </span>
                </Link>
              )}
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-2.5 sm:space-x-3.5 w-44 justify-end z-10 text-neutral-600 dark:text-neutral-300">
              <button
                onClick={openSearch}
                className="p-1.5 hover:text-[#B68D40] transition-colors focus:outline-none"
                aria-label="Open search modal"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                to="/wishlist"
                className="p-1.5 hover:text-[#B68D40] transition-colors relative"
                aria-label="Go to wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#B68D40] rounded-full" />
                )}
              </Link>

              <button
                onClick={onOpenCart}
                className="p-1.5 hover:text-[#B68D40] transition-colors relative focus:outline-none"
                aria-label="Open cart bag"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B68D40] text-white text-[8px] font-sans font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="p-1.5 hover:text-[#B68D40] transition-colors"
                aria-label="Go to profile"
              >
                <User className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* DESKTOP ROW 2: Centered Navigation Menu */}
          <nav className="hidden md:flex w-full items-center justify-center space-x-5 text-[10px] tracking-[0.2em] font-sans font-semibold text-neutral-500 uppercase pb-6">
            <Link
              to="/"
              className={`transition-colors duration-200 ${pathname === '/' ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
            >
              HOME
            </Link>
            <span className="text-neutral-300 font-light select-none">|</span>

            <Link
              to="/look-and-shop"
              className={`transition-colors duration-200 ${pathname === '/look-and-shop' ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
            >
              LOOK & SHOP
            </Link>
            <span className="text-neutral-300 font-light select-none">|</span>

            {/* Shop item with interactive drop down trigger */}
            <div 
              onMouseEnter={() => setShowMegaMenu(true)}
              className="relative py-1"
            >
              <Link
                to="/shop"
                className={`transition-colors duration-200 flex items-center gap-1 ${pathname.startsWith('/shop') ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
              >
                <span>SHOP</span>
                <span className="text-[7px] text-neutral-400">{showMegaMenu ? '▲' : '▼'}</span>
              </Link>
            </div>
            <span className="text-neutral-300 font-light select-none">|</span>

            <Link
              to="/customize"
              className={`transition-colors duration-200 ${pathname === '/customize' ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
            >
              CUSTOMISE
            </Link>
            <span className="text-neutral-300 font-light select-none">|</span>

            <Link
              to="/about"
              className={`transition-colors duration-200 ${pathname === '/about' ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
            >
              ABOUT
            </Link>
            <span className="text-neutral-300 font-light select-none">|</span>

            <Link
              to="/contact"
              className={`transition-colors duration-200 ${pathname === '/contact' ? 'text-[#B68D40]' : 'hover:text-[#B68D40]'}`}
            >
              CONTACT
            </Link>
          </nav>

          {/* DESKTOP MEGA DROP-DOWN MENU OVERLAY */}
          {showMegaMenu && (
            <div className="absolute left-0 right-0 top-full bg-[#FFFFFF] text-[#181818] border border-[#ECECEC] rounded-b-2xl shadow-xl p-8 z-50 animate-page-fade-in">
              <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8">
                
                {/* Column 1: MEN */}
                <div className="col-span-3 space-y-6 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                      <svg className="w-5 h-5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 3L12 8L18 3M12 8V21M6 3H9M18 3H15" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 8H20" strokeLinecap="round"/>
                      </svg>
                      <h3 className="font-serif text-sm tracking-widest uppercase font-bold text-neutral-850">MEN</h3>
                    </div>

                    <div className="flex flex-col space-y-2 text-xs text-neutral-600 font-sans font-semibold">
                      <Link to="/shop?category=MEN&subcategory=Kurtas" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Kurtas</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=MEN&subcategory=Sherwanis" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Sherwanis</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=MEN" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Dhotis</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                    </div>
                  </div>

                  <div className="aspect-[1.5/1] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                    <img src={menSherwaniSun} alt="Men's collection" className="w-full h-full object-cover object-top" />
                  </div>
                </div>

                {/* Column 2: WOMEN */}
                <div className="col-span-3 space-y-6 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                      <svg className="w-5 h-5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 3L16 9M12 3L8 9M8 9H16M8 9L6 21H18L16 9" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className="font-serif text-sm tracking-widest uppercase font-bold text-neutral-855">WOMEN</h3>
                    </div>

                    <div className="flex flex-col space-y-1.5 text-xs text-neutral-600 font-sans font-semibold">
                      <Link to="/shop?category=WOMEN&subcategory=Sarees" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Sarees</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=WOMEN&subcategory=Lehengas" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Lehengas</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=WOMEN&subcategory=Anarkalis" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Anarkalis</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=WOMEN" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Indo-Western</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=WOMEN&subcategory=Sarees" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Pre-Draped Sarees</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=WOMEN&subcategory=Anarkalis" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Frocks</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                    </div>
                  </div>

                  <div className="aspect-[2.3/1] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                    <img src={womenMaroonLehenga} alt="Women's collection" className="w-full h-full object-cover object-center" />
                  </div>
                </div>

                {/* Column 3: KIDS */}
                <div className="col-span-3 space-y-6 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                      <svg className="w-5 h-5 text-[#B68D40]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="8" cy="7" r="3"/>
                        <circle cx="16" cy="7" r="3"/>
                        <path d="M4 18C4 15 6 13 8 13M20 18C20 15 18 13 16 13" strokeLinecap="round"/>
                      </svg>
                      <h3 className="font-serif text-sm tracking-widest uppercase font-bold text-neutral-860">KIDS</h3>
                    </div>

                    <div className="flex flex-col space-y-2 text-xs text-neutral-600 font-sans font-semibold">
                      <Link to="/shop?category=KIDS" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Girls</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                      <Link to="/shop?category=KIDS" className="flex justify-between items-center hover:text-[#B68D40] group py-0.5">
                        <span>Boys</span>
                        <span className="text-[10px] text-neutral-400 group-hover:translate-x-1 transition-transform">&gt;</span>
                      </Link>
                    </div>
                  </div>

                  <div className="aspect-[1.3/1] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100">
                    <img src={kidsEthnicWear} alt="Kids collection" className="w-full h-full object-cover object-center" />
                  </div>
                </div>

                {/* Column 4: Couple card */}
                <div className="col-span-3 rounded-2xl overflow-hidden relative aspect-[0.78/1] border border-neutral-100 flex flex-col justify-end p-6 text-left">
                  <img src={coupleWeddingIvory} alt="Wedding couple" className="absolute inset-0 w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  
                  <div className="relative z-10 space-y-4 text-white">
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl leading-tight">
                        Timeless<br/>Tradition.<br/><span className="text-[#D9C7A3] italic font-light">Modern You.</span>
                      </h3>
                      <p className="text-[9px] font-sans text-neutral-300 leading-relaxed uppercase tracking-wider">
                        Explore our handpicked designer collections.
                      </p>
                    </div>

                    <Link 
                      to="/shop"
                      className="bg-[#1D2820] hover:bg-[#B68D40] text-[#D9C7A3] hover:text-white border border-[#B68D40] px-4 py-2.5 text-[8.5px] font-sans font-bold tracking-widest uppercase transition-all duration-300 w-full flex items-center justify-center gap-1.5"
                    >
                      <span>VIEW ALL COLLECTIONS</span>
                      <span>&gt;</span>
                    </Link>
                  </div>
                </div>

              </div>

              {/* Bottom value props row */}
              <div className="max-w-[1440px] mx-auto border-t border-neutral-100 pt-6 mt-6 grid grid-cols-4 gap-4 text-center text-xs">
                <div className="flex items-center justify-center gap-2 py-1">
                  <svg className="w-4 h-4 text-[#B68D40] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-[#181818]">Free Shipping</p>
                    <p className="text-[9.5px] text-neutral-400">Across India</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-1">
                  <svg className="w-4 h-4 text-[#B68D40] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-[#181818]">Premium Quality</p>
                    <p className="text-[9.5px] text-neutral-400">Assured</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-1">
                  <svg className="w-4 h-4 text-[#B68D40] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-[#181818]">Stylist Support</p>
                    <p className="text-[9.5px] text-neutral-400">+91 89783 59546</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-1">
                  <svg className="w-4 h-4 text-[#B68D40] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="font-bold text-[#181818]">Easy Returns</p>
                    <p className="text-[9.5px] text-neutral-400">Within 7 Days</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </header>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white dark:bg-[#181818] h-full flex flex-col p-8 transition-transform duration-500 shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[#181818] dark:text-[#F8F6F2] focus:outline-none hover:text-[#B68D40]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-12 mt-6">
              <span className="font-serif text-2xl tracking-[0.25em] font-light block">ETNIKO</span>
              <span className="text-[7.5px] tracking-[0.35em] uppercase font-sans text-[#B68D40] mt-2 block font-bold">
                - DESIGNER BOUTIQUE -
              </span>
            </div>

            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`text-xs tracking-[0.2em] font-sans font-semibold uppercase transition-colors ${
                      isActive ? 'text-[#B68D40]' : 'text-[#181818] dark:text-[#F8F6F2]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto border-t border-[#ECECEC] pt-6 flex flex-col space-y-4">
              <Link
                to="/admin"
                className="text-[10px] tracking-[0.2em] font-sans text-neutral-400 hover:text-[#B68D40]"
              >
                ADMIN WORKSPACE
              </Link>
              <p className="text-[9px] font-sans text-neutral-400">© 2026 ETNIKO Studio. Hyderabad Boutique.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
