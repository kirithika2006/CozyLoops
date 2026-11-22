import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const empty = { fullName: '', phone: '', email: '', address: '', city: '', state: '', pinCode: '', customerNotes: '' };

export default function CheckoutPage() {
  const { cartItems, removePurchasedItems, isLoaded } = useCart();
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [productError, setProductError] = useState('');
  const submitting = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');
  const requestedQuantity = Number(searchParams.get('quantity') || 1);
  const isBuyNow = Boolean(productId);
  const quantityIsValid = Number.isSafeInteger(requestedQuantity) && requestedQuantity >= 1 && requestedQuantity <= 100;
  const routeProduct = location.state?.buyNowProduct;

  useEffect(() => {
    let active = true;
    if (!productId) {
      setBuyNowProduct(null);
      setProductError('');
      setProductLoading(false);
      return () => { active = false; };
    }
    if (routeProduct?._id === productId) {
      setBuyNowProduct(routeProduct);
      setProductError('');
      setProductLoading(false);
      return () => { active = false; };
    }

    setProductLoading(true);
    setProductError('');
    productService.getProduct(productId)
      .then(result => { if (active) setBuyNowProduct(result.product); })
      .catch(error => {
        if (active) setProductError(error.response?.data?.message || 'This product could not be loaded. Return to the product page and try again.');
      })
      .finally(() => { if (active) setProductLoading(false); });
    return () => { active = false; };
  }, [productId, routeProduct]);

  const checkoutItems = isBuyNow
    ? (buyNowProduct && quantityIsValid ? [{ ...buyNowProduct, quantity: requestedQuantity }] : [])
    : cartItems;
  const subtotal = checkoutItems.reduce((sum, item) => {
    const unitPrice = Number(item.price) * (1 - Number(item.discount || 0) / 100);
    return sum + unitPrice * item.quantity;
  }, 0);

  const submit = async event => {
    event.preventDefault();
    if (submitting.current || !checkoutItems.length || !quantityIsValid) return;
    submitting.current = true;
    setBusy(true);
    try {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
      const result = await orderService.create({
        customer: {
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          address: form.address,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode
        },
        customerNotes: form.customerNotes,
        items: checkoutItems.map(item => ({ productId: item._id, quantity: item.quantity }))
      }, token);

      try {
        const savedOrders = JSON.parse(localStorage.getItem('cozyloops_orders') || '[]');
        localStorage.setItem('cozyloops_orders', JSON.stringify([
          { orderId: result.order.orderId, token: result.orderAccessToken },
          ...savedOrders.filter(order => order.orderId !== result.order.orderId)
        ].slice(0, 50)));
      } catch (storageError) {
        console.warn('Could not save this device\'s order tracking shortcut.');
      }

      if (!isBuyNow) removePurchasedItems(checkoutItems);
      navigate(`/order-confirmation/${encodeURIComponent(result.order.orderId)}`, {
        state: { order: result.order }
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not place your order. Please review your details and cart.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };

  if (!isLoaded || productLoading) return <LoadingSpinner fullScreen />;
  if (productError || (isBuyNow && !quantityIsValid)) {
    return <main className="max-w-3xl mx-auto px-4 py-16 text-center"><div className="card-premium p-8"><h1 className="font-display text-2xl font-bold">Unable to start checkout</h1><p role="alert" className="mt-3 text-red-600">{productError || 'The selected quantity is invalid. Return to the product page and choose a valid quantity.'}</p><Link className="text-pink-600 inline-block mt-5" to={productId ? `/product/${productId}` : '/shop'}>Return to shopping</Link></div></main>;
  }
  if (!checkoutItems.length) {
    return <div className="max-w-3xl mx-auto p-10 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><Link className="text-pink-600" to="/shop">Continue shopping</Link></div>;
  }

  const field = (key, label, props = {}) => (
    <label className="block text-sm font-medium" htmlFor={`checkout-${key}`}>
      {label}
      <input id={`checkout-${key}`} required value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} className="input-field mt-1" {...props} />
    </label>
  );

  return (
    <>
      <Helmet><title>Checkout - cozy.loopsss_</title></Helmet>
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="font-display text-3xl font-bold mb-7">Checkout</h1>
        <form onSubmit={submit} className="grid lg:grid-cols-5 gap-8">
          <section className="lg:col-span-3 card-premium p-6 space-y-4">
            <h2 className="text-xl font-semibold">Delivery details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {field('fullName', 'Full name', { maxLength: 120, autoComplete: 'name' })}
              {field('phone', 'Phone number', { type: 'tel', maxLength: 20, autoComplete: 'tel' })}
              {field('email', 'Email address', { type: 'email', maxLength: 254, autoComplete: 'email' })}
              <div className="sm:col-span-2">{field('address', 'Complete delivery address', { maxLength: 500, autoComplete: 'street-address' })}</div>
              {field('city', 'City', { maxLength: 100, autoComplete: 'address-level2' })}
              {field('state', 'State', { maxLength: 100, autoComplete: 'address-level1' })}
              {field('pinCode', 'Pincode', { maxLength: 12, autoComplete: 'postal-code' })}
            </div>
            <label className="block text-sm font-medium" htmlFor="checkout-notes">Order notes (optional)
              <textarea id="checkout-notes" value={form.customerNotes} onChange={event => setForm({ ...form, customerNotes: event.target.value })} className="textarea-field mt-1" maxLength={2000} />
            </label>
            <p className="text-sm text-gray-600">Payment is arranged manually with cozy.loopsss_ through WhatsApp after placing your order.</p>
          </section>
          <aside className="lg:col-span-2 card-premium p-6 h-fit">
            <h2 className="font-semibold text-xl mb-4">Order summary</h2>
            <div className="space-y-4">
              {checkoutItems.map(item => {
                const unitPrice = Number(item.price) * (1 - Number(item.discount || 0) / 100);
                return <div className="flex gap-3" key={item._id}>
                  <img className="w-14 h-14 rounded object-cover" src={item.images?.[0]?.url || '/cozyloops-trademark.png'} alt={item.name} />
                  <div className="flex-1"><div>{item.name}</div><div className="text-xs text-gray-500">SKU: {item.sku || '—'} · Qty {item.quantity}</div><div className="text-xs text-gray-500">₹{unitPrice.toFixed(2)} each</div></div>
                  <b>₹{(unitPrice * item.quantity).toFixed(2)}</b>
                </div>;
              })}
            </div>
            <div className="border-t mt-4 pt-4 space-y-2">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>Free</span></div>
              <div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{subtotal.toFixed(2)}</span></div>
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full mt-5 disabled:opacity-50">
              {busy ? 'Placing order…' : 'Place order'}
            </button>
          </aside>
        </form>
      </main>
    </>
  );
}
