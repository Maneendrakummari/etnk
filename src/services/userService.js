import { mockOrders } from '../mock/orders';
import { mockCustomizations } from '../mock/customizations';

const simulateLatency = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

const mockUserProfile = {
  id: "cust-user-1",
  name: "Radhika Sen",
  phone: "+91 98300 12345",
  email: "radhika.sen@example.com",
  addresses: [
    {
      name: "Radhika Sen",
      phone: "+91 98300 12345",
      addressLine1: "Apt 4B, Silver Oak Residences",
      addressLine2: "Road No. 12, Banjara Hills",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500034",
      country: "India"
    }
  ],
  createdAt: "2026-01-15T08:00:00.000Z"
};

export const userService = {
  // User Profile
  getUserProfile: () => {
    return simulateLatency(mockUserProfile);
  },

  updateUserProfile: (profileData) => {
    Object.assign(mockUserProfile, profileData);
    return simulateLatency(mockUserProfile);
  },

  // User Addresses
  addAddress: (address) => {
    mockUserProfile.addresses.push(address);
    return simulateLatency(mockUserProfile.addresses);
  },

  deleteAddress: (index) => {
    mockUserProfile.addresses.splice(index, 1);
    return simulateLatency(mockUserProfile.addresses);
  },

  // User Orders
  getUserOrders: () => {
    const orders = mockOrders.filter(o => o.customerId === mockUserProfile.id);
    return simulateLatency(orders);
  },

  createOrder: (orderData) => {
    const newOrder = {
      id: `ord-${mockOrders.length + 1}`,
      customerId: mockUserProfile.id,
      customerName: mockUserProfile.name,
      customerPhone: mockUserProfile.phone,
      customerEmail: mockUserProfile.email,
      ...orderData,
      paymentStatus: orderData.paymentMethod === 'razorpay' ? 'paid' : 'pending',
      orderStatus: 'New',
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: 'New', timestamp: new Date().toISOString(), note: 'Order created successfully via checkout.' }
      ]
    };
    mockOrders.unshift(newOrder);
    return simulateLatency(newOrder);
  },

  // Customization styling requests
  getUserCustomizations: () => {
    const customizations = mockCustomizations.filter(c => c.email === mockUserProfile.email);
    return simulateLatency(customizations);
  },

  submitCustomizationRequest: (requestData) => {
    const newRequest = {
      id: `cust-${mockCustomizations.length + 1}`,
      customerName: mockUserProfile.name,
      phone: mockUserProfile.phone,
      email: mockUserProfile.email,
      status: 'New',
      notes: [
        { author: 'System', text: 'Styling request submitted.', timestamp: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString(),
      ...requestData
    };
    mockCustomizations.unshift(newRequest);
    return simulateLatency(newRequest);
  },

  // Admin CMS & Operations
  getAllOrders: () => {
    return simulateLatency(mockOrders);
  },

  getAllCustomizations: () => {
    return simulateLatency(mockCustomizations);
  },

  updateOrderStatus: (id, status, trackingNumber) => {
    const order = mockOrders.find(o => o.id === id);
    if (!order) return simulateLatency(null);
    order.orderStatus = status;
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: `Status updated to ${status} by admin.`
    });
    return simulateLatency(order);
  },

  updateCustomizationStatus: (id, status, stylistNote) => {
    const cust = mockCustomizations.find(c => c.id === id);
    if (!cust) return simulateLatency(null);
    cust.status = status;
    if (stylistNote) {
      cust.notes.push({
        author: 'Boutique Stylist',
        text: stylistNote,
        timestamp: new Date().toISOString()
      });
    }
    return simulateLatency(cust);
  }
};
