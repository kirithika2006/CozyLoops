import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { productService } from '../services/productService';
import { commentService } from '../services/commentService';
import ProductGallery from '../components/product/ProductGallery';
import ProductDetails from '../components/product/ProductDetails';
import ProductReview from '../components/product/ProductReview';
import RelatedProducts from '../components/product/RelatedProducts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProduct(id);
        setProduct(response.product);
        
        // Fetch product reviews
        const reviewsResponse = await commentService.getComments({
          type: 'product',
          typeId: id
        });
        setReviews(reviewsResponse.comments || []);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        toast.error('Product not found');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleAddReview = async (reviewData) => {
    try {
      const response = await commentService.addComment({
        ...reviewData,
        type: 'product',
        typeId: id
      });
      setReviews([response.comment, ...reviews]);
      toast.success('Review added successfully! 💕');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧶</div>
          <h2 className="text-2xl font-display text-secondary-dark mb-2">
            Product Not Found
          </h2>
          <p className="text-secondary-dark/60">
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.name} - cozy.loopsss_`}</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Breadcrumb */}
        <nav className="text-sm text-secondary-dark/60 mb-6">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Shop</span>
          <span className="mx-2">/</span>
          <span className="text-primary-rosePink">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div>
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Details */}
          <div>
            <ProductDetails product={product} />
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <ProductReview reviews={reviews} onAddReview={handleAddReview} />
        </div>

        {/* Related Products */}
        <RelatedProducts productId={product._id} categoryId={product.category?._id} />
      </motion.div>
    </>
  );
};

export default ProductPage;