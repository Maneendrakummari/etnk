import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, ChevronLeft, ChevronRight, Search as SearchIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import SkeletonLoader from '../components/common/SkeletonLoader';

const CATEGORIES = ['ALL', 'WOMEN', 'MEN', 'KIDS'];
const FABRICS = ['ALL', 'Mulberry Silk', 'Banarasi Brocade', 'Chanderi Silk', 'Georgette', 'Organza', 'Tussar Silk', 'Raw Silk', 'Cotton Silk Blend'];
const COLORS = ['ALL', 'Ivory', 'Champagne Gold', 'Crimson Red', 'Emerald Green', 'Royal Blue', 'Dusty Pink', 'Midnight Black', 'Warm Mustard'];
const OCCASIONS = ['ALL', 'Bridal & Wedding', 'Festive & Pujas', 'Sangeet & Cocktails', 'Mehendi & Haldi', 'Royal Dinners'];

const PRICE_RANGES = [
  { label: 'All Prices', value: null },
  { label: 'Under ₹10,000', value: [0, 10000] },
  { label: '₹10,000 – ₹20,000', value: [10000, 20000] },
  { label: '₹20,000 – ₹30,000', value: [20000, 30000] },
  { label: 'Above ₹30,000', value: [30000, 100000] }
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read filter states from URL search params to ensure shareable links
  const categoryParam = searchParams.get('category') || 'ALL';
  const subcategoryParam = searchParams.get('subcategory') || 'ALL';
  const fabricParam = searchParams.get('fabric') || 'ALL';
  const colorParam = searchParams.get('color') || 'ALL';
  const occasionParam = searchParams.get('occasion') || 'ALL';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const priceMinParam = searchParams.get('min_price') ? parseInt(searchParams.get('min_price'), 10) : 0;
  const priceMaxParam = searchParams.get('max_price') ? parseInt(searchParams.get('max_price'), 10) : 100000;

  // Set local state for search input
  const [searchInput, setSearchInput] = useState(searchParam);

  // Sync search input with URL searchParam
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  // Fetch products when filters or pages change
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const res = await productService.getProducts({
          category: categoryParam,
          subcategory: subcategoryParam === 'ALL' ? undefined : subcategoryParam,
          fabric: fabricParam === 'ALL' ? undefined : fabricParam,
          color: colorParam === 'ALL' ? undefined : colorParam,
          occasion: occasionParam === 'ALL' ? undefined : occasionParam,
          priceRange: [priceMinParam, priceMaxParam],
          sort: sortParam,
          search: searchParam,
          page: pageParam,
          limit: 12
        });
        setProducts(res.products);
        setPagination(res.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [categoryParam, subcategoryParam, fabricParam, colorParam, occasionParam, priceMinParam, priceMaxParam, sortParam, searchParam, pageParam]);

  const updateParam = (key, value, resetPage = true) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'ALL') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (resetPage) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('q', searchInput);
  };

  const handlePriceRangeSelect = (range) => {
    const newParams = new URLSearchParams(searchParams);
    if (range) {
      newParams.set('min_price', range[0]);
      newParams.set('max_price', range[1]);
    } else {
      newParams.delete('min_price');
      newParams.delete('max_price');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const hasActiveFilters = categoryParam !== 'ALL' || subcategoryParam !== 'ALL' || fabricParam !== 'ALL' || colorParam !== 'ALL' || occasionParam !== 'ALL' || priceMinParam > 0 || priceMaxParam < 100000 || searchParam;

  return (
    <div className="bg-[#FFFFFF] text-[#181818] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

      {/* Catalog Filters Controls & Grid wrapper */}
      <div className="flex gap-8 relative items-start">
        
        {/* Left Side: Desktop Filter Bar */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8 sticky top-24 max-h-[80vh] overflow-y-auto pr-4 custom-scrollbar">
          
          {/* Header clear */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="w-full py-2 border border-[#B42318] text-[#B42318] text-[9px] tracking-widest font-sans font-semibold uppercase hover:bg-[#B42318] hover:text-white transition-colors"
            >
              Clear Active Filters
            </button>
          )}

          {/* Categories select list */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b border-[#ECECEC] dark:border-neutral-800 pb-1.5">
              Categories
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`text-left hover:text-[#B68D40] transition-colors ${
                    categoryParam === cat ? 'text-[#B68D40] font-semibold' : ''
                  }`}
                >
                  {cat === 'ALL' ? 'All Garments' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range selections */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b border-[#ECECEC] dark:border-neutral-800 pb-1.5">
              Price Range
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
              {PRICE_RANGES.map((range, idx) => {
                const active = (!range.value && priceMinParam === 0 && priceMaxParam === 100000) ||
                  (range.value && priceMinParam === range.value[0] && priceMaxParam === range.value[1]);
                return (
                  <button
                    key={idx}
                    onClick={() => handlePriceRangeSelect(range.value)}
                    className={`text-left hover:text-[#B68D40] transition-colors ${
                      active ? 'text-[#B68D40] font-semibold' : ''
                    }`}
                  >
                    {range.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fabrics selections */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b border-[#ECECEC] dark:border-neutral-800 pb-1.5">
              Fabrics
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
              {FABRICS.map(fab => (
                <button
                  key={fab}
                  onClick={() => updateParam('fabric', fab)}
                  className={`text-left hover:text-[#B68D40] transition-colors ${
                    fabricParam === fab ? 'text-[#B68D40] font-semibold' : ''
                  }`}
                >
                  {fab === 'ALL' ? 'All Fabrics' : fab}
                </button>
              ))}
            </div>
          </div>

          {/* Colors selection */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b border-[#ECECEC] dark:border-neutral-800 pb-1.5">
              Colors
            </h4>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(col => (
                <button
                  key={col}
                  onClick={() => updateParam('color', col)}
                  className={`px-3 py-1.5 border text-[9px] tracking-wider uppercase transition-colors font-sans ${
                    colorParam === col
                      ? 'border-[#B68D40] bg-[#B68D40] text-white'
                      : 'border-[#ECECEC] dark:border-neutral-800 hover:border-[#B68D40] text-neutral-600 dark:text-neutral-300'
                  }`}
                >
                  {col === 'ALL' ? 'All Colors' : col}
                </button>
              ))}
            </div>
          </div>

          {/* Occasions selections */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase border-b border-[#ECECEC] dark:border-neutral-800 pb-1.5">
              Occasions
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
              {OCCASIONS.map(occ => (
                <button
                  key={occ}
                  onClick={() => updateParam('occasion', occ)}
                  className={`text-left hover:text-[#B68D40] transition-colors ${
                    occasionParam === occ ? 'text-[#B68D40] font-semibold' : ''
                  }`}
                >
                  {occ === 'ALL' ? 'All Occasions' : occ}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Side: Product Grid and Sorting headers */}
        <div className="flex-grow space-y-6">
          
          {/* Header Controls: Sorting, search inputs, counts, mobile filters toggle */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border-b border-[#ECECEC] dark:border-neutral-800 pb-4">
            
            <div className="flex items-center justify-between md:justify-start gap-4">
              {/* Product count */}
              <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest">
                {pagination.totalItems} Garments found
              </span>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center gap-1.5 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-[10px] uppercase tracking-widest font-sans font-bold focus:outline-none text-[#181818] dark:text-[#F8F6F2]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Actions: Search bar & Sort selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Text Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative flex-grow md:flex-grow-0 md:w-56">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="SEARCH CATALOG..."
                  className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 py-1.5 pl-3 pr-8 text-xs font-sans tracking-wider text-[#181818] dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#B68D40] uppercase"
                />
                <button type="submit" className="absolute right-2 top-2 text-neutral-400 hover:text-[#B68D40]">
                  <SearchIcon className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Sorting */}
              <div className="flex items-center gap-1 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 bg-transparent shrink-0">
                <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans">Sort:</span>
                <select
                  value={sortParam}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="bg-transparent text-xs text-[#181818] dark:text-[#F8F6F2] font-sans font-semibold border-none outline-none focus:ring-0 cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-sans mr-2">Active:</span>
              {categoryParam !== 'ALL' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>{categoryParam}</span>
                  <button onClick={() => updateParam('category', 'ALL')} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {fabricParam !== 'ALL' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>Fabric: {fabricParam}</span>
                  <button onClick={() => updateParam('fabric', 'ALL')} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {colorParam !== 'ALL' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>Color: {colorParam}</span>
                  <button onClick={() => updateParam('color', 'ALL')} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {occasionParam !== 'ALL' && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>Occasion: {occasionParam}</span>
                  <button onClick={() => updateParam('occasion', 'ALL')} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(priceMinParam > 0 || priceMaxParam < 100000) && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>₹{priceMinParam.toLocaleString()} - ₹{priceMaxParam.toLocaleString()}</span>
                  <button onClick={() => handlePriceRangeSelect(null)} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchParam && (
                <span className="flex items-center gap-1 px-3 py-1 bg-[#F8F6F2] dark:bg-neutral-800 text-[10px] tracking-wide font-sans text-neutral-600 dark:text-neutral-300 border border-[#ECECEC] dark:border-neutral-700">
                  <span>Search: {searchParam}</span>
                  <button onClick={() => updateParam('q', '')} className="text-neutral-400 hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Product grid displaying items */}
          {loading ? (
            <SkeletonLoader count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty state for search/filters */
            <div className="py-20 text-center space-y-4 border border-[#ECECEC] dark:border-neutral-800">
              <h3 className="font-serif text-xl tracking-wider text-text-custom dark:text-primary uppercase">
                No matching couture garments
              </h3>
              <p className="text-xs text-neutral-500 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                Try clearing some active filters or modifying search keywords to explore alternative fabrics.
              </p>
              <button
                onClick={clearAllFilters}
                className="btn-luxury mt-4"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-6 pt-10 border-t border-[#ECECEC] dark:border-neutral-800">
              <button
                onClick={() => updateParam('page', pageParam - 1)}
                disabled={pageParam === 1}
                className="p-2 border border-neutral-300 dark:border-neutral-700 hover:border-[#B68D40] disabled:opacity-30 disabled:hover:border-neutral-300 transition-colors focus:outline-none"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4 text-neutral-800 dark:text-primary" />
              </button>

              <span className="text-xs font-sans text-neutral-500 uppercase tracking-widest font-semibold">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                onClick={() => updateParam('page', pageParam + 1)}
                disabled={pageParam === pagination.totalPages}
                className="p-2 border border-neutral-300 dark:border-neutral-700 hover:border-[#B68D40] disabled:opacity-30 disabled:hover:border-neutral-300 transition-colors focus:outline-none"
                aria-label="Next Page"
              >
                <ChevronRight className="w-4 h-4 text-neutral-800 dark:text-primary" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Filters Side Drawer overlay */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex justify-start md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            />

            {/* Filter Drawer Body */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="relative w-4/5 max-w-sm bg-white dark:bg-[#181818] h-full flex flex-col p-6 shadow-2xl z-10 overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-[#ECECEC] dark:border-neutral-800 pb-4 mb-6">
                <span className="font-serif text-lg tracking-wider">FILTERS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 focus:outline-none text-[#181818] dark:text-[#F8F6F2]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h5 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase">Categories</h5>
                  <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          updateParam('category', cat);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left ${categoryParam === cat ? 'text-[#B68D40] font-semibold' : ''}`}
                      >
                        {cat === 'ALL' ? 'All Garments' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div className="space-y-2">
                  <h5 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase">Price Range</h5>
                  <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
                    {PRICE_RANGES.map((range, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handlePriceRangeSelect(range.value);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left ${
                          (!range.value && priceMinParam === 0 && priceMaxParam === 100000) ||
                          (range.value && priceMinParam === range.value[0] && priceMaxParam === range.value[1])
                            ? 'text-[#B68D40] font-semibold'
                            : ''
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fabrics */}
                <div className="space-y-2">
                  <h5 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase">Fabrics</h5>
                  <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
                    {FABRICS.map(fab => (
                      <button
                        key={fab}
                        onClick={() => {
                          updateParam('fabric', fab);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left ${fabricParam === fab ? 'text-[#B68D40] font-semibold' : ''}`}
                      >
                        {fab === 'ALL' ? 'All Fabrics' : fab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <h5 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase">Colors</h5>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map(col => (
                      <button
                        key={col}
                        onClick={() => {
                          updateParam('color', col);
                          setMobileFiltersOpen(false);
                        }}
                        className={`px-3 py-1.5 border text-[9px] tracking-wider uppercase transition-colors font-sans ${
                          colorParam === col
                            ? 'border-[#B68D40] bg-[#B68D40] text-white'
                            : 'border-[#ECECEC] dark:border-neutral-800 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {col === 'ALL' ? 'All Colors' : col}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div className="space-y-2">
                  <h5 className="text-[10px] tracking-widest text-[#B68D40] font-sans font-bold uppercase">Occasions</h5>
                  <div className="flex flex-col space-y-2 text-xs font-sans text-neutral-600 dark:text-neutral-300">
                    {OCCASIONS.map(occ => (
                      <button
                        key={occ}
                        onClick={() => {
                          updateParam('occasion', occ);
                          setMobileFiltersOpen(false);
                        }}
                        className={`text-left ${occasionParam === occ ? 'text-[#B68D40] font-semibold' : ''}`}
                      >
                        {occ === 'ALL' ? 'All Occasions' : occ}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
}
