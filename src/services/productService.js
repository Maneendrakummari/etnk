import { mockProducts } from '../mock/products';

const simulateLatency = (data, failRate = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error("Network Error. Please try again."));
      } else {
        resolve(data);
      }
    }, 600);
  });
};

export const productService = {
  // Query products with filters, sorting, and pagination
  getProducts: ({ category, subcategory, fabric, color, occasion, priceRange, sort, search, page = 1, limit = 12 }) => {
    let filtered = [...mockProducts];

    // Search query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.designer.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'ALL') {
      filtered = filtered.filter(p => p.category.toUpperCase() === category.toUpperCase());
    }

    // Subcategory filter
    if (subcategory && subcategory !== 'ALL') {
      filtered = filtered.filter(p => p.subcategory.toLowerCase() === subcategory.toLowerCase());
    }

    // Fabric filter
    if (fabric && fabric !== 'ALL') {
      filtered = filtered.filter(p => p.fabric.toLowerCase() === fabric.toLowerCase());
    }

    // Color filter
    if (color && color !== 'ALL') {
      filtered = filtered.filter(p => p.color.toLowerCase() === color.toLowerCase());
    }

    // Occasion filter
    if (occasion && occasion !== 'ALL') {
      filtered = filtered.filter(p => p.occasion.toLowerCase() === occasion.toLowerCase());
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange;
      filtered = filtered.filter(p => {
        const actualPrice = p.discountPrice || p.price;
        return actualPrice >= min && actualPrice <= max;
      });
    }

    // Sort order
    if (sort) {
      switch (sort) {
        case 'price-asc':
          filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          // Keep default mock order
          break;
      }
    }

    // Pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const paginatedItems = filtered.slice(offset, offset + limit);

    return simulateLatency({
      products: paginatedItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        limit
      }
    });
  },

  // Get single product details
  getProductById: (id) => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) return simulateLatency(null);
    
    // Add reviews list and related items to detail payload
    const related = mockProducts.filter(p => product.relatedProducts.includes(p.id));
    return simulateLatency({
      ...product,
      relatedProductsData: related
    });
  },

  getProductBySlug: (slug) => {
    const product = mockProducts.find(p => p.slug === slug);
    if (!product) return simulateLatency(null);
    const related = mockProducts.filter(p => product.relatedProducts.includes(p.id));
    return simulateLatency({
      ...product,
      relatedProductsData: related
    });
  },

  // Admin CMS endpoints
  createProduct: (productData) => {
    const newProduct = {
      id: `prod-${mockProducts.length + 1}`,
      slug: `${productData.category.toLowerCase()}-${productData.subcategory.toLowerCase().replace(/\s+/g, '-')}-${mockProducts.length + 1}`,
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockProducts.unshift(newProduct);
    return simulateLatency(newProduct);
  },

  updateProduct: (id, productData) => {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) return simulateLatency(null);
    mockProducts[idx] = {
      ...mockProducts[idx],
      ...productData,
      updatedAt: new Date().toISOString()
    };
    return simulateLatency(mockProducts[idx]);
  },

  deleteProduct: (id) => {
    const idx = mockProducts.findIndex(p => p.id === id);
    if (idx === -1) return simulateLatency(false);
    mockProducts.splice(idx, 1);
    return simulateLatency(true);
  }
};
