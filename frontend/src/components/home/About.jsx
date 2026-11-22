import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaAward, FaStar, FaUsers } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: FaHeart,
      title: 'Handmade with Love',
      description: 'Every piece is carefully crafted with attention to detail and love'
    },
    {
      icon: FaAward,
      title: 'Quality Materials',
      description: 'We use premium yarns and materials for lasting quality'
    },
    {
      icon: FaStar,
      title: 'Unique Designs',
      description: 'Each creation is unique, making your order truly special'
    },
    {
      icon: FaUsers,
      title: 'Community Focused',
      description: 'Supporting local artisans and the crochet community'
    },
  ];

  return (
    <section className="py-16 bg-primary-lightPink/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-2">About cozy.loopsss_</h2>
          <p className="text-secondary-dark/60 max-w-2xl mx-auto">
            We're passionate about creating beautiful crochet pieces that bring joy to your life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="font-display text-3xl md:text-4xl font-bold leading-relaxed text-secondary-dark">
              Your Destination for <span className="text-primary-darkPink">Handmade Crochet</span>
            </h3>
            <p className="text-secondary-dark/70 leading-relaxed">
              cozy.loopsss_ was born from a love of crochet and a desire to share that joy with others. 
              Our mission is to create beautiful, high-quality crochet pieces that bring warmth and 
              happiness to every home.
            </p>
            <p className="text-secondary-dark/70 leading-relaxed">
              From custom flowers and bouquets to adorable plushies and accessories, 
              each piece is made with the same dedication to quality and attention to detail. 
              We believe in the power of handmade gifts to create lasting memories.
            </p>

            {/* Removed the "Meet Our Team" section */}

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
              <div>
                <p className="font-display text-2xl font-bold text-primary-rosePink">100+</p>
                <p className="text-sm text-secondary-dark/60">Happy Customers</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary-rosePink">50+</p>
                <p className="text-sm text-secondary-dark/60">Unique Designs</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-primary-rosePink">4.9</p>
                <p className="text-sm text-secondary-dark/60">Average Rating</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-3xl bg-secondary-gray">
              <img
                src="https://t4.ftcdn.net/jpg/00/92/10/87/360_F_92108736_2pK0ze82VQNRHmvE2EZKioQhFPhIAjW3.jpg"
                alt="Colorful crochet yarn and handmade crochet flowers"
                className="block h-72 w-full object-cover sm:h-96"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-secondary-gray bg-white p-4 text-center shadow-sm transition-shadow duration-200 hover:shadow-soft"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-pink/10 rounded-full flex items-center justify-center">
                <feature.icon className="text-primary-rosePink text-xl" />
              </div>
              <h4 className="font-semibold text-secondary-dark text-sm mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-secondary-dark/60">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
