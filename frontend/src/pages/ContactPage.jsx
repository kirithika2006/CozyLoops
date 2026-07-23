import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaInstagram, 
  FaMapMarkerAlt,
  FaClock
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: '9445084921',
      action: 'Chat Now',
      href: 'https://wa.me/919445084921',
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'cozyloopsss21@gmail.com',
      action: 'Send Email',
      href: 'mailto:cozyloopsss21@gmail.com',
      color: 'text-red-500',
      bg: 'bg-red-50'
    },
    {
      icon: FaInstagram,
      label: 'Instagram',
      value: '@cozy.loopsss_',
      action: 'Follow Us',
      href: 'https://instagram.com/cozy.loopsss_',
      color: 'text-pink-500',
      bg: 'bg-pink-50'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'India',
      action: 'View Map',
      href: '#',
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - CozyLoops</title>
        <meta name="description" content="Get in touch with CozyLoops for custom crochet orders, inquiries, or just to say hello!" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary-dark mb-3">
              Get in Touch
            </h1>
            <p className="text-secondary-dark/60 max-w-2xl mx-auto">
              Have questions about our crochet creations? Want to place a custom order? 
              We'd love to hear from you!
            </p>
          </motion.div>
        </div>

        {/* Contact Cards - Full width layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Owner Info */}
          <div className="card-premium p-8 text-center max-w-md mx-auto mb-8">
            <div className="w-24 h-24 bg-gradient-pink rounded-full flex items-center justify-center mx-auto mb-4 text-4xl shadow-premium">
              🧶
            </div>
            <h3 className="font-display text-2xl font-bold text-secondary-dark">
              Narmadha
            </h3>
            <p className="text-secondary-dark/60">Founder & Lead Crochet Artist</p>
            <p className="text-sm text-secondary-dark/60 mt-2 font-cursive text-lg">
              "Every stitch tells a story"
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.a
                key={index}
                href={info.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="card-premium p-6 flex flex-col items-center text-center hover:shadow-premium transition-all duration-300"
              >
                <div className={`w-14 h-14 ${info.bg} rounded-full flex items-center justify-center mb-3`}>
                  <info.icon className={`text-3xl ${info.color}`} />
                </div>
                <p className="text-sm text-secondary-dark/60">{info.label}</p>
                <p className="font-semibold text-secondary-dark text-base">{info.value}</p>
                <span className="text-xs text-primary-rosePink mt-1 font-medium">{info.action}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Quick Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center max-w-md mx-auto"
        >
          <div className="bg-primary-lightPink/30 rounded-2xl p-6">
            <p className="text-lg text-secondary-dark/70">
              💝 We typically respond within 24 hours
            </p>
          </div>
        </motion.div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <div className="card-premium p-6 max-w-4xl mx-auto">
            <h3 className="font-display text-xl font-bold text-secondary-dark mb-4 text-center">
              Find Us
            </h3>
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-babyPink/20 to-primary-softPeach/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3">📍</div>
                <p className="text-secondary-dark/60 text-lg">We're based in India</p>
                <p className="text-sm text-secondary-dark/40 mt-1">Map location coming soon</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default ContactPage;