import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  VolumeX, 
  Volume2, 
  Heart, 
  ShoppingBag, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Star,
  Scissors
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from '../components/common/QuickViewModal';
import redLehengaLook from '../assets/red_lehenga_look.png';

// Mock high-fidelity looks to match the screenshot exactly
const LOOKS_DATA = [
  {
    id: "look-1",
    title: "Blush Elegance",
    description: "Timeless saree look for weddings",
    duration: "0:32",
    tags: ["Saree", "Earrings"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-beautiful-woman-in-traditional-indian-dress-41314-large.mp4",
    products: [
      {
        id: "lkp-1",
        name: "Blush Embroidered Saree",
        price: 18500,
        fabric: "Organza Silk",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
        sizes: ["XS", "S", "M", "L", "XL"],
        stock: 5,
        description: "Intricately embroidered blush rose organza saree with hand-turned scalloped gota edges.",
        designer: "Niharika"
      },
      {
        id: "lkp-2",
        name: "Poiki Chandbali Earrings",
        price: 4950,
        fabric: "Gold Plated Kundan",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
        sizes: ["One Size"],
        stock: 10,
        description: "Classic Hyderabad double-crescent chandbali earrings in gold plating and freshwater pearls.",
        designer: "Niharika Accessories"
      }
    ]
  },
  {
    id: "look-2",
    title: "Sunlit Grace",
    description: "Perfect for haldi & daytime events",
    duration: "0:28",
    tags: ["Anarkali", "Dupatta"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-in-anarkali-suit-modeling-in-studio-41315-large.mp4",
    products: [
      {
        id: "lkp-3",
        name: "Mustard Silk Anarkali",
        price: 16500,
        fabric: "Chanderi Silk",
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
        sizes: ["S", "M", "L"],
        stock: 4,
        description: "Mustard yellow traditional pleated Chanderi Anarkali with subtle gold block prints.",
        designer: "Niharika"
      }
    ]
  },
  {
    id: "look-3",
    title: "Royal Teal",
    description: "A modern regal affair",
    duration: "0:30",
    tags: ["Lehenga", "Necklace"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-indian-traditional-clothing-41317-large.mp4",
    products: [
      {
        id: "lkp-4",
        name: "Teal Zardozi Lehenga",
        price: 36800,
        fabric: "Raw Silk",
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80",
        sizes: ["S", "M", "L"],
        stock: 2,
        description: "Stunning teal blue raw silk lehenga features detailed gold zardozi leaf work.",
        designer: "Niharika"
      },
      {
        id: "lkp-5",
        name: "Kundan Statement Necklace",
        price: 8950,
        fabric: "Kundan Gold",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
        sizes: ["One Size"],
        stock: 3,
        description: "Heavy jadau kundan choker necklace with green enamel drops.",
        designer: "Niharika Accessories"
      }
    ]
  },
  {
    id: "look-4",
    title: "Classic Charm",
    description: "Gentlemen's festive edit",
    duration: "0:27",
    tags: ["Kurta", "Jacket"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-man-wearing-traditional-indian-clothes-modeling-41320-large.mp4",
    products: [
      {
        id: "lkp-6",
        name: "Beige Threadwork Kurta",
        price: 6450,
        fabric: "Tussar Silk",
        image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=400&q=80",
        sizes: ["M", "L", "XL"],
        stock: 8,
        description: "Classic self-thread embroidered kurta in premium beige handloom silk.",
        designer: "Sabyasachi Edit"
      }
    ]
  },
  {
    id: "look-5",
    title: "Lilac Dream",
    description: "For receptions & celebrations",
    duration: "0:31",
    tags: ["Lehenga", "Maang Tikka"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-modelling-indian-traditional-clothing-41317-large.mp4",
    products: [
      {
        id: "lkp-7",
        name: "Pearl Maang Tikka",
        price: 2450,
        fabric: "Faux Pearls",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
        sizes: ["One Size"],
        stock: 12,
        description: "Delicate seed pearl clusters surrounding a central kundan stud.",
        designer: "Niharika Accessories"
      }
    ]
  },
  {
    id: "look-6",
    title: "Emerald Muse",
    description: "Rich, festive & unforgettable",
    duration: "0:29",
    tags: ["Saree", "Necklace"],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-indian-woman-posing-with-traditional-handloom-saree-41316-large.mp4",
    products: [
      {
        id: "lkp-8",
        name: "Emerald Green Kanjeevaram",
        price: 24500,
        fabric: "Kanjeevaram Silk",
        image: "https://images.unsplash.com/photo-1610030470298-4c5855797ee3?auto=format&fit=crop&w=400&q=80",
        sizes: ["One Size"],
        stock: 3,
        description: "Traditional pure mulberry silk Kanjeevaram saree in emerald green with solid zari borders.",
        designer: "Niharika"
      }
    ]
  }
];

export default function LookAndShop() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [activeLookIdx, setActiveLookIdx] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // References for video tag triggers
  const activeLook = LOOKS_DATA[activeLookIdx];

  const handleQuickAdd = (product) => {
    // Adapter to match standard product schema
    const standardProd = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      sizes: product.sizes,
      stock: product.stock,
      description: product.description,
      designer: product.designer,
      slug: product.id
    };
    addToCart(standardProd, product.sizes[0]);
  };

  const handleQuickView = (product) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      images: [product.image],
      sizes: product.sizes,
      stock: product.stock,
      description: product.description,
      designer: product.designer,
      slug: product.id,
      fabric: product.fabric
    });
    setQuickViewOpen(true);
  };

  return (
    <div className="bg-[#FFFFFF] text-[#181818] min-h-screen space-y-16 pb-12">
      
      {/* SECTION 1: HERO BANNER */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-8">
        <div className="space-y-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#B68D40] font-sans font-bold block">
            WATCH. INSPIRE. SHOP.
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-light tracking-wide leading-tight uppercase">
            Looks You Love,<br />Pieces You Adore.
          </h1>
          <p className="text-xs font-sans text-neutral-500 leading-relaxed max-w-md">
            Explore our handpicked looks styled by our designers. Tap on any product in the video to shop instantly.
          </p>
          <button
            onClick={() => {
              // Scroll to looks directory
              const target = document.getElementById("looks-directory");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 py-3 border border-[#B68D40] text-xs font-sans font-bold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-colors duration-300 flex items-center gap-2"
          >
            <span className="w-5 h-5 rounded-full border border-black/40 flex items-center justify-center text-[9px] pl-0.5">▶</span>
            <span>HOW IT WORKS</span>
          </button>
        </div>

        <div className="relative aspect-[16/10] w-full border border-[#D9C7A3] bg-neutral-100 overflow-hidden shadow-sm">
          <img
            src={redLehengaLook}
            alt="Red Lehenga Editorial Look"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </section>

      {/* SECTION 2: WATCH OUR LOOKS DIRECTORY */}
      <section id="looks-directory" className="max-w-7xl mx-auto px-6 space-y-8 pt-6">
        <div className="text-center space-y-1.5">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#B68D40] font-sans font-bold">WATCH OUR LOOKS</span>
          <h2 className="text-xl md:text-2xl font-serif tracking-widest uppercase">Scroll, watch and shop the entire look</h2>
          <div className="w-12 h-0.5 bg-[#B68D40] mx-auto mt-2" />
        </div>

        {/* Horizontal scroll grid of looks */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {LOOKS_DATA.map((look, idx) => {
            const isSelected = idx === activeLookIdx;
            const isPlaying = playingVideoId === look.id;
            return (
              <div
                key={look.id}
                onClick={() => {
                  setActiveLookIdx(idx);
                  setPlayingVideoId(isPlaying ? null : look.id);
                }}
                className={`group cursor-pointer space-y-3.5 ${
                  isSelected ? 'scale-[1.02]' : 'opacity-85 hover:opacity-100'
                } transition-all duration-300`}
              >
                {/* Video container */}
                <div className={`relative aspect-[3/4] bg-neutral-50 border ${
                  isSelected ? 'border-[#B68D40] shadow-md' : 'border-[#ECECEC]'
                } overflow-hidden`}>
                  {isPlaying ? (
                    <video
                      src={look.videoUrl}
                      autoPlay loop muted playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={look.products[0].image}
                      alt={look.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* play button overlay */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center shadow-md">
                        <span className="text-[10px] text-neutral-900 pl-0.5">▶</span>
                      </div>
                    </div>
                  )}

                  {/* duration badge */}
                  <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[8px] font-sans px-1.5 py-0.5">
                    {look.duration}
                  </span>

                  {/* bottom tag pills */}
                  <div className="absolute bottom-2.5 inset-x-2.5 flex flex-wrap gap-1">
                    {look.tags.map(t => (
                      <span key={t} className="bg-white/80 dark:bg-black/80 text-neutral-900 dark:text-white text-[8px] font-sans font-semibold px-2 py-0.5 uppercase tracking-wider rounded-none">
                        + {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Text details */}
                <div className="space-y-0.5">
                  <h4 className={`text-[10.5px] uppercase font-sans font-bold tracking-wider ${
                    isSelected ? 'text-[#B68D40]' : 'text-neutral-800'
                  }`}>
                    {look.title}
                  </h4>
                  <p className="text-[9px] font-sans text-neutral-400 leading-snug line-clamp-1">{look.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: SHOP THE LOOK */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        
        {/* Left Column Description */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-serif text-lg tracking-widest text-[#181818] uppercase">SHOP THE LOOK</h3>
          <p className="text-xs font-sans text-neutral-400 leading-relaxed">
            Curated pieces from the video you just watched.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-5 py-3 border border-[#B68D40] text-[9px] font-sans font-bold tracking-widest uppercase hover:bg-neutral-900 hover:text-white transition-colors duration-300 w-full lg:w-auto"
          >
            VIEW ALL PRODUCTS
          </button>
        </div>

        {/* Middle Column Product Shelf */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          {activeLook.products.map((p) => {
            const inWish = isInWishlist(p.id);
            return (
              <div key={p.id} className="group relative border border-[#ECECEC] flex flex-col justify-between h-full bg-white shadow-sm">
                <div className="relative aspect-[3/3.8] block bg-neutral-50 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500"
                  />
                  {/* wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist({ id: p.id, name: p.name, price: p.price, images: [p.image] })}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-neutral-800 hover:text-[#B68D40] transition-colors focus:outline-none z-10"
                  >
                    <Heart className={`w-3.5 h-3.5 ${inWish ? 'fill-[#B68D40] text-[#B68D40]' : ''}`} />
                  </button>
                </div>
                <div className="p-3.5 space-y-1.5 border-t">
                  <span className="text-[8px] uppercase tracking-wider text-neutral-400 font-sans block">{p.designer}</span>
                  <h4 className="font-serif text-[10.5px] uppercase text-[#181818] line-clamp-1">
                    {p.name}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] font-sans font-semibold pt-1">
                    <span>₹{p.price.toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => handleQuickAdd(p)}
                      className="p-1 hover:text-[#B68D40] transition-colors"
                      aria-label="Add to bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column Promo Card */}
        <div className="lg:col-span-3 bg-neutral-50 border border-[#ECECEC] p-6 flex flex-col justify-between items-center text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="font-serif text-lg tracking-wider text-neutral-800 uppercase">Love a look?</h3>
            <p className="text-[11px] font-sans text-neutral-500 leading-relaxed">
              Get it customised just for you.
            </p>
          </div>

          <div className="w-full aspect-[4/3] bg-neutral-100 overflow-hidden border">
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80"
              alt="Tailor consultation detail"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={() => navigate('/customize')}
              className="w-full py-3 bg-[#181818] text-[#F8F6F2] hover:bg-[#B68D40] text-[9.5px] font-sans font-bold tracking-widest uppercase transition-colors"
            >
              REQUEST CUSTOMISATION
            </button>
            <a
              href="https://wa.me/919830012345"
              target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-1.5 text-[10px] font-sans font-bold text-[#3E7C59] hover:text-[#B68D40] transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat with our stylist</span>
            </a>
          </div>
        </div>

      </section>

      {/* SECTION 4: VALUE PROPOSITIONS FOOTER BAR */}
      <section className="max-w-7xl mx-auto px-6 border-t border-[#ECECEC] pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Sparkles className="w-5 h-5 text-[#B68D40]" />
            <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">HANDPICKED LOOKS</h4>
            <p className="text-[9px] font-sans text-neutral-400">Curated by our in-house designers</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Star className="w-5 h-5 text-[#B68D40]" />
            <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">PREMIUM QUALITY</h4>
            <p className="text-[9px] font-sans text-neutral-400">Finest fabrics & craftsmanship</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Scissors className="w-5 h-5 text-[#B68D40]" />
            <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">CUSTOMISATION AVAILABLE</h4>
            <p className="text-[9px] font-sans text-neutral-400">Made just for you</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#B68D40]" />
            <h4 className="text-[10px] tracking-wider font-sans font-bold uppercase text-[#181818]">SECURE SHOPPING</h4>
            <p className="text-[9px] font-sans text-neutral-400">Safe & easy checkout</p>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewOpen && selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          isOpen={quickViewOpen}
          onClose={() => {
            setQuickViewOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}

    </div>
  );
}
