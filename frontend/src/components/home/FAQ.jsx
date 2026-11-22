import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How long does it take to receive my order?',
      answer: 'Each piece is handmade to order, so production typically takes 5-10 business days. Shipping time depends on your location, but we usually deliver within 3-5 business days after dispatch.'
    },
    {
      question: 'Can I customize my order?',
      answer: 'Yes! We love creating custom pieces. You can choose colors, sizes, and even send us reference photos for personalized orders. Just mention your requirements when placing an order or contact us directly.'
    },
    {
      question: 'What materials do you use?',
      answer: 'We use high-quality, soft, and durable yarns that are carefully selected for each project. All materials are safe and non-toxic, perfect for all ages.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship worldwide! International shipping times and costs vary by location. We ensure careful packaging to protect your handmade items during transit.'
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 24 hours of placing it. After that, production may have started, but please contact us and we\'ll do our best to accommodate your request.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We want you to love your cozy.loopsss_ creation! If you\'re not satisfied, please contact us within 7 days of delivery. Each item is handmade with care, so we handle returns on a case-by-case basis.'
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-2">Frequently Asked Questions</h2>
          <p className="text-secondary-dark/60">Everything you need to know about cozy.loopsss_</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="glass-morphism rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-primary-babyPink/5 transition-colors"
              >
                <span className="font-medium text-secondary-dark">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 ml-4 p-1 bg-primary-babyPink/20 rounded-full">
                  {activeIndex === index ? (
                    <FaMinus className="text-primary-rosePink text-sm" />
                  ) : (
                    <FaPlus className="text-primary-rosePink text-sm" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-secondary-dark/70 leading-relaxed border-t border-primary-babyPink/20 pt-4">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;