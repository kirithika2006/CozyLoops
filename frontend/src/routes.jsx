import { lazy } from 'react'

// Lazy load all pages for code splitting
export const routes = {
  home: {
    path: '/',
    component: lazy(() => import('./pages/HomePage')),
  },
  product: {
    path: '/product/:id',
    component: lazy(() => import('./pages/ProductPage')),
  },
  cart: {
    path: '/cart',
    component: lazy(() => import('./pages/CartPage')),
  },
  wishlist: {
    path: '/wishlist',
    component: lazy(() => import('./pages/WishlistPage')),
  },
  contact: {
    path: '/contact',
    component: lazy(() => import('./pages/ContactPage')),
  },
  search: {
    path: '/search',
    component: lazy(() => import('./pages/SearchPage')),
  },
  notFound: {
    path: '*',
    component: lazy(() => import('./pages/NotFound')),
  },
}

// Public routes (accessible to everyone)
export const publicRoutes = [
  routes.home,
  routes.product,
  routes.contact,
  routes.search,
  routes.notFound,
]

// Protected routes (admin only)
export const adminRoutes = [
  // Admin dashboard routes will be added here
]