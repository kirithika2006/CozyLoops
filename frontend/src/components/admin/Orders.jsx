import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaCheck, FaClock, FaTruck, FaSearch } from 'react-icons/fa';

const Orders = () => {
  // Mock orders data - in production, this would come from an API
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'Priya Sharma',
      email: 'priya@email.com',
      items: 3,
      total: 2499,
      status: 'delivered',
      date: '2024-12-15',
      address: '123 Main St, Mumbai, India'
    },
    {
      id: 'ORD-002',
      customer: 'Aisha Patel',
      email: 'aisha@email.com',
      items: 2,
      total: 1599,
      status: 'shipped',
      date: '2024-12-14',
      address: '456 Park Ave, Delhi, India'
    },
    {
      id: 'ORD-003',
      customer: 'Meera Reddy',
      email: 'meera@email.com',
      items: 5,
      total: 4599,
      status: 'processing',
      date: '2024-12-13',
      address: '789 Lake View, Bangalore, India'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    const colors = {
      processing: 'text-yellow-500 bg-yellow-50',
      shipped: 'text-blue-500 bg-blue-50',
      delivered: 'text-green-500 bg-green-50',
      cancelled: 'text-red-500 bg-red-50'
    };
    return colors[status] || 'text-gray-500 bg-gray-50';
  };

  const getStatusIcon = (status) => {
    const icons = {
      processing: <FaClock />,
      shipped: <FaTruck />,
      delivered: <FaCheck />,
      cancelled: <FaBox />
    };
    return icons[status] || <FaBox />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-secondary-dark">
          Orders
        </h2>
        <p className="text-secondary-dark/60">Manage customer orders</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-dark/40" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select-field w-40"
        >
          <option value="all">All Status</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="glass-morphism rounded-3xl p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-display text-secondary-dark mb-2">
            No Orders Found
          </h3>
          <p className="text-secondary-dark/60">
            {searchTerm ? 'No orders match your search' : 'No orders have been placed yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card-premium p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-secondary-dark">{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-secondary-dark mt-1">
                    {order.customer}
                  </h4>
                  <p className="text-sm text-secondary-dark/60">{order.email}</p>
                  <p className="text-sm text-secondary-dark/60">{order.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-rosePink">
                    ₹{order.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-secondary-dark/60">
                    {order.items} items
                  </p>
                  <p className="text-xs text-secondary-dark/40">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;