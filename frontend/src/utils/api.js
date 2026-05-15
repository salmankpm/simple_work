// Mock Data to replace backend
let mockOrders = [];
let mockUsers = [{
  _id: 'u1',
  name: 'Test User',
  email: 'test@test.com',
  password: 'password', // in real life hashed
  token: 'mock-token',
  address: '123 Test St'
}];

const mockRestaurants = [
  {
    _id: "1",
    name: "Burger Haven",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    menu: [
      { _id: "m1", name: "Classic Cheeseburger", price: 8.99, description: "Juicy beef patty with cheese", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80" },
      { _id: "m2", name: "Crispy Fries", price: 3.99, description: "Golden crispy potato fries", image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=300&q=80" }
    ]
  },
  {
    _id: "2",
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&q=80",
    menu: [
      { _id: "m3", name: "Margherita Pizza", price: 12.99, description: "Classic cheese and tomato", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80" },
      { _id: "m4", name: "Pepperoni Pizza", price: 14.99, description: "Loaded with pepperoni", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&q=80" }
    ]
  },
  {
    _id: "3",
    name: "Sushi World",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "40-55 min",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80",
    menu: [
      { _id: "m5", name: "Spicy Tuna Roll", price: 11.99, description: "Fresh tuna with spicy mayo", image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80" },
      { _id: "m6", name: "Salmon Nigiri", price: 9.99, description: "Fresh salmon over rice", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&q=80" }
    ]
  }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  get: async (url) => {
    await delay(300);
    if (url === '/restaurants') {
      return { data: mockRestaurants };
    }
    if (url.startsWith('/restaurants/')) {
      const id = url.split('/').pop();
      const restaurant = mockRestaurants.find(r => r._id === id);
      if (restaurant) return { data: restaurant };
      throw { response: { data: { message: 'Not found' } } };
    }
    if (url.startsWith('/orders/')) {
      const id = url.split('/').pop();
      const order = mockOrders.find(o => o._id === id);
      if (order) return { data: order };
      throw { response: { data: { message: 'Not found' } } };
    }
    throw new Error(`GET ${url} not mock configured`);
  },
  post: async (url, body) => {
    await delay(300);
    if (url === '/auth/login') {
      const user = mockUsers.find(u => u.email === body.email && u.password === body.password);
      if (user) {
        return { data: { _id: user._id, name: user.name, email: user.email, token: user.token, address: user.address } };
      }
      throw { response: { data: { message: 'Invalid email or password' } } };
    }
    if (url === '/auth/register') {
      const exists = mockUsers.find(u => u.email === body.email);
      if (exists) throw { response: { data: { message: 'User already exists' } } };
      const newUser = {
        _id: 'u' + Math.random().toString().substring(2, 8),
        ...body,
        token: 'mock-token-' + Math.random().toString().substring(2, 8)
      };
      mockUsers.push(newUser);
      return { data: { _id: newUser._id, name: newUser.name, email: newUser.email, token: newUser.token, address: newUser.address } };
    }
    if (url === '/orders') {
      const newOrder = {
        _id: 'ord' + Math.random().toString().substring(2, 8),
        ...body,
        restaurant: mockRestaurants.find(r => r._id === body.restaurant) || body.restaurant,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      mockOrders.push(newOrder);
      return { data: newOrder };
    }
    throw new Error(`POST ${url} not mock configured`);
  },
  put: async (url, body) => {
    await delay(300);
    if (url.match(/\/orders\/.*\/status/)) {
      const id = url.split('/')[2];
      const orderIndex = mockOrders.findIndex(o => o._id === id);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = body.status;
        return { data: mockOrders[orderIndex] };
      }
      throw { response: { data: { message: 'Not found' } } };
    }
    throw new Error(`PUT ${url} not mock configured`);
  }
};

export default api;
