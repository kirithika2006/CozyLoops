import React from 'react';

const SkeletonLoader = ({ type = 'product', count = 4 }) => {
  const renderProductSkeleton = () => (
    <div className="card-premium p-4">
      <div className="skeleton w-full h-64 rounded-xl mb-4" />
      <div className="skeleton w-3/4 h-4 rounded mb-2" />
      <div className="skeleton w-1/2 h-4 rounded mb-2" />
      <div className="skeleton w-1/3 h-6 rounded" />
    </div>
  );

  const renderVideoSkeleton = () => (
    <div className="card-premium p-4">
      <div className="skeleton w-full h-48 rounded-xl mb-4" />
      <div className="skeleton w-3/4 h-4 rounded mb-2" />
      <div className="skeleton w-1/2 h-4 rounded" />
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="w-full h-[600px] glass-morphism rounded-3xl p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="skeleton w-64 h-16 rounded mx-auto mb-4" />
        <div className="skeleton w-96 h-8 rounded mx-auto mb-6" />
        <div className="skeleton w-48 h-12 rounded-full mx-auto" />
      </div>
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="card-premium p-6">
      <div className="skeleton w-16 h-16 rounded-full mx-auto mb-4" />
      <div className="skeleton w-3/4 h-4 rounded mx-auto mb-2" />
      <div className="skeleton w-1/2 h-4 rounded mx-auto" />
    </div>
  );

  const getSkeleton = () => {
    switch (type) {
      case 'product':
        return renderProductSkeleton();
      case 'video':
        return renderVideoSkeleton();
      case 'hero':
        return renderHeroSkeleton();
      case 'card':
        return renderCardSkeleton();
      default:
        return renderProductSkeleton();
    }
  };

  return (
    <div className="grid-auto-fit">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{getSkeleton()}</div>
      ))}
    </div>
  );
};

export default SkeletonLoader;