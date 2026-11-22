import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { commentService } from '../../services/commentService';
import SkeletonLoader from '../common/SkeletonLoader';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Fetch only product reviews
        const response = await commentService.getComments({ 
          type: 'product',
          limit: 20
        });
        setReviews(response.comments || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Helper to get star rating (default to 5 if not specified)
  const getRating = (comment) => {
    // You can add a rating field to comments or default to 5
    return comment.rating || 5;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-2">Customer Reviews</h2>
            <p className="text-secondary-dark/60">What our lovely customers say about us</p>
          </div>
          <SkeletonLoader type="card" count={3} />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title mb-2">Customer Reviews</h2>
            <p className="text-secondary-dark/60">What our lovely customers say about us</p>
          </motion.div>

          <div className="glass-morphism rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-2xl font-display text-secondary-dark mb-2">
              No Reviews Yet
            </h3>
            <p className="text-secondary-dark/60">
              Be the first to review our beautiful crochet creations!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title mb-2">Customer Reviews</h2>
          <p className="text-secondary-dark/60">What our lovely customers say about us</p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={review._id || index}>
              <motion.div
                whileHover={{ y: -5 }}
                className="card-premium p-6 h-full"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-pink flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {review.name ? review.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-secondary-dark">{review.name || 'Anonymous'}</h4>
                    <p className="text-sm text-secondary-dark/60">
                      {review.productName || 'Crochet Lover'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, index) => {
                    const rating = getRating(review);
                    return (
                      <FaStar
                        key={index}
                        className={`${
                          index < Math.floor(rating)
                            ? 'text-yellow-400'
                            : index < rating
                            ? 'text-yellow-400 opacity-50'
                            : 'text-gray-300'
                        } text-sm`}
                      />
                    );
                  })}
                </div>

                <div className="relative">
                  <FaQuoteLeft className="text-primary-babyPink/30 text-2xl absolute -top-1 -left-1" />
                  <p className="text-secondary-dark/80 text-sm leading-relaxed px-4 py-2">
                    {review.comment}
                  </p>
                  <FaQuoteRight className="text-primary-babyPink/30 text-2xl absolute -bottom-1 -right-1" />
                </div>

                <p className="text-xs text-secondary-dark/40 mt-3 text-right">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric'
                  }) : 'Recent'}
                </p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
