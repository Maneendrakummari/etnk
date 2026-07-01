import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Heart, 
  ShoppingBag, 
  Eye, 
  ArrowRight,
  Scissors,
  Truck,
  ShieldCheck,
  UserCheck,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/productService';
import { mockVideos } from '../mock/videos';
import greenLehengaHero from '../assets/green_lehenga_hero.png';
import ivorySareeLook from '../assets/ivory_saree_look.png';

// Unsplash collection image list for six primary categories
const EXPLORE_CATEGORIES = [
  {
    name: "SAREES",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=WOMEN&subcategory=Sarees"
  },
  {
    name: "LEHENGAS",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=WOMEN&subcategory=Lehengas"
  },
  {
    name: "ANARKALIS",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=WOMEN&subcategory=Anarkalis"
  },
  {
    name: "FROCKS",
    image: "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=KIDS"
  },
  {
    name: "INDO-WESTERN",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=WOMEN&subcategory=Indo-Western"
  },
  {
    name: "PRE-DRAPED SAREES",
    image: "https://images.unsplash.com/photo-1610030470298-4c5855797ee3?auto=format&fit=crop&w=500&q=80",
    path: "/shop?category=WOMEN&subcategory=Sarees"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [below10kProducts, setBelow10kProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hero carousel details
  const heroSlides = [
    {
      image: greenLehengaHero,
      title: "Timeless Heritage.\nModern Elegance.",
      subtitle: "Exquisite ethnic wear crafted for every celebration and every you.",
    },
    {
      image: ivorySareeLook,
      title: "Handspun Heritage.\nCustom Fits.",
      subtitle: "Celebrating standard curves with direct waist-rise hook adjustments.",
    },
    {
      image: "https://images.unsplash.com/photo-1610030470298-4c5855797ee3?auto=format&fit=crop&w=1600&q=80",
      title: "Banaras & Chanderi.\nDirect to Wardrobe.",
      subtitle: "Pure handlooms straight from pit looms to boutique custom boxes.",
    }
  ];

  // Auto scroll slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch products under 10k
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getProducts({ page: 1, limit: 12 });
        // Filter products priced under or equal to 10k
        const under10k = res.products.filter(p => p.price <= 12000).slice(0, 4);
        setBelow10kProducts(under10k);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePrevHero = () => {
    setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNextHero = () => {
    setCurrentSlide(prev => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="bg-etniko-cream text-[#181818] min-h-screen space-y-16 pb-20">
      
      {/* 1. Hero Carousel */}
      <section className="relative h-[80vh] md:h-[90vh] w-full bg-[#181818] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={heroSlides[currentSlide].image}
              alt="Luxury Editorial Lookbook"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-4xl z-10 text-white">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-6xl font-serif font-light tracking-wide leading-tight whitespace-pre-line"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xs md:text-sm font-sans font-light tracking-wider mt-4 max-w-xl text-neutral-200"
              >
                {heroSlides[currentSlide].subtitle}
              </motion.p>

              <motion.div
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  onClick={() => navigate('/shop')}
                  className="px-8 py-3.5 bg-[#181818]/90 border border-[#B68D40] text-xs font-sans font-bold tracking-widest uppercase hover:bg-[#B68D40] hover:text-white transition-all text-[#D9C7A3]"
                >
                  SHOP COLLECTION
                </button>
                <button
                  onClick={() => navigate('/look-and-shop')}
                  className="px-8 py-3.5 bg-transparent border border-[#B68D40] text-xs font-sans font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all text-white flex items-center gap-2"
                >
                  <span className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[9px] pl-0.5">▶</span>
                  <span>LOOK & SHOP</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel arrows */}
        <button
          onClick={handlePrevHero}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-all z-20"
          aria-label="Prev Hero Banner"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextHero}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white transition-all z-20"
          aria-label="Next Hero Banner"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full border border-white transition-all ${
                currentSlide === idx ? 'bg-white' : 'bg-transparent'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Value Proposition bar */}
      <section className="w-full bg-etniko-cream-alt py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-x-0 md:divide-x divide-neutral-300">
            <div className="flex flex-col items-center p-4 space-y-2">
              <Star className="w-5 h-5 text-[#B68D40]" />
              <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">PREMIUM FABRICS</h4>
              <p className="text-[9.5px] font-sans text-neutral-400">Finest quality, handpicked with care</p>
            </div>
            <div className="flex flex-col items-center p-4 space-y-2">
              <Scissors className="w-5 h-5 text-[#B68D40]" />
              <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">CUSTOM TAILORING</h4>
              <p className="text-[9.5px] font-sans text-neutral-400">Made to measure, just for you</p>
            </div>
            <div className="flex flex-col items-center p-4 space-y-2">
              <Truck className="w-5 h-5 text-[#B68D40]" />
              <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">FREE SHIPPING</h4>
              <p className="text-[9.5px] font-sans text-neutral-400">Across India on all orders</p>
            </div>
            <div className="flex flex-col items-center p-4 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#B68D40]" />
              <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">SECURE PAYMENT</h4>
              <p className="text-[9.5px] font-sans text-neutral-400">100% secure & trusted checkout</p>
            </div>
            <div className="flex flex-col items-center p-4 space-y-2">
              <UserCheck className="w-5 h-5 text-[#B68D40]" />
              <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">PERSONAL STYLIST</h4>
              <p className="text-[9.5px] font-sans text-neutral-400">Expert guidance for the perfect look</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore Our Collections */}
      <section className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-serif tracking-widest text-[#181818] uppercase">
            EXPLORE OUR COLLECTIONS
          </h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-[#B68D40]" />
            <span className="text-[9px] text-[#B68D40] font-sans">✦</span>
            <span className="w-8 h-[1px] bg-[#B68D40]" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {EXPLORE_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group aspect-[3/4] relative overflow-hidden bg-neutral-100 border border-[#ECECEC]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 text-center text-white space-y-1">
                <h4 className="font-serif text-[11px] tracking-widest uppercase">{cat.name}</h4>
                <span className="text-[8px] tracking-[0.2em] font-sans text-neutral-300 group-hover:text-[#B68D40] transition-colors block">
                  SHOP NOW
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Double Column Grid: BELOW 10K WEAR & LOOK & SHOP */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
        
        {/* Left Column: Below 10k Wear */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#ECECEC] pb-3">
            <h3 className="font-serif text-lg tracking-wider text-[#181818] uppercase">BELOW ₹10K WEAR</h3>
            <Link to="/shop?maxPrice=10000" className="text-[9px] tracking-widest font-sans font-bold text-[#B68D40] hover:text-black uppercase">
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {below10kProducts.map((p, idx) => (
              <div key={p.id} className="group relative border border-[#ECECEC] flex flex-col justify-between h-full bg-white">
                <Link to={`/product/${p.slug}`} className="relative aspect-[3/3.8] block bg-neutral-50 overflow-hidden">
                  {idx % 2 === 0 ? (
                    <span className="absolute top-2 left-2 bg-[#B68D40] text-white text-[8px] font-sans font-bold tracking-wider px-2 py-0.5 z-10">
                      NEW
                    </span>
                  ) : idx === 1 ? (
                    <span className="absolute top-2 left-2 bg-neutral-900 text-white text-[8px] font-sans font-bold tracking-wider px-2 py-0.5 z-10">
                      BESTSELLER
                    </span>
                  ) : null}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                </Link>
                <div className="p-3.5 space-y-1.5 border-t">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-sans block">{p.designer}</span>
                  <Link to={`/product/${p.slug}`} className="font-serif text-[10px] uppercase text-[#181818] hover:text-[#B68D40] block line-clamp-1">
                    {p.name}
                  </Link>
                  <div className="flex justify-between items-center text-[10px] font-sans font-semibold pt-1">
                    <span>₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="text-neutral-400 font-light text-[9px] italic">{p.fabric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Look & Shop */}
        <div className="space-y-6">
          <div className="flex justify-between items-end border-b border-[#ECECEC] pb-3">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg tracking-wider text-[#181818] uppercase">LOOK & SHOP</h3>
              <p className="text-[9.5px] font-sans text-neutral-400">Watch styles you love. Shop the look instantly.</p>
            </div>
            <Link to="/look-and-shop" className="text-[9px] tracking-widest font-sans font-bold text-[#B68D40] hover:text-black uppercase">
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { id: "las-1", title: "Royal Wedding Look", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80" },
              { id: "las-2", title: "Mehendi Magic", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80" },
              { id: "las-3", title: "Pastel Perfection", image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80" },
              { id: "las-4", title: "Festive Glam", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=500&q=80" }
            ].map((lk) => (
              <div
                key={lk.id}
                onClick={() => navigate(`/look-and-shop?look=${lk.id}`)}
                className="group relative aspect-[3.2/2.1] bg-neutral-100 border border-[#ECECEC] overflow-hidden cursor-pointer shadow-sm"
              >
                <img
                  src={lk.image}
                  alt={lk.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-[10px] text-neutral-900 pl-0.5">▶</span>
                  </div>
                </div>
                <div className="absolute bottom-2 left-3 text-white">
                  <h4 className="text-[9.5px] uppercase tracking-wider font-sans font-bold">{lk.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
