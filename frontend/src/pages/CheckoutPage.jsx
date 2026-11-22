import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const empty = { fullName: '', phone: '', email: '', address: '', city: '', state: '', pinCode: '', customerNotes: '' };
export default function CheckoutPage() {
  const { cartItems, cartTotal, removePurchasedItems } = useCart();
  const [form, setForm] = useState(empty), [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault(); if (!cartItems.length || busy) return;
    setBusy(true);
    try {
      const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
      const data = await orderService.create({ customer: { fullName: form.fullName, phone: form.phone, email: form.email, address: form.address, city: form.city, state: form.state, pinCode: form.pinCode }, customerNotes: form.customerNotes, items: cartItems.map(i => ({ productId: i._id, quantity: i.quantity })) }, token);
      const saved = JSON.parse(localStorage.getItem('cozyloops_orders') || '[]');
      localStorage.setItem('cozyloops_orders', JSON.stringify([{ orderId: data.order.orderId, token: data.orderAccessToken }, ...saved.filter(o => o.orderId !== data.order.orderId)].slice(0, 50)));
      removePurchasedItems(cartItems);
      navigate(`/order-confirmation/${encodeURIComponent(data.order.orderId)}`, { state: { order: data.order } });
    } catch (err) { toast.error(err.response?.data?.message || 'Could not place your order. Please review your cart.'); }
    finally { setBusy(false); }
  };
  if (!cartItems.length) return <div className="max-w-3xl mx-auto p-10 text-center"><h1 className="text-2xl font-bold">Your cart is empty</h1><Link className="text-pink-600" to="/shop">Continue shopping</Link></div>;
  const field = (key, label, props = {}) => <label className="block text-sm font-medium">{label}<input required={!['customerNotes'].includes(key)} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className="input-field mt-1" {...props} /></label>;
  return <main className="max-w-6xl mx-auto px-4 py-10"><h1 className="font-display text-3xl font-bold mb-7">Checkout</h1><form onSubmit={submit} className="grid lg:grid-cols-5 gap-8"><section className="lg:col-span-3 card-premium p-6 space-y-4"><h2 className="text-xl font-semibold">Delivery details</h2><div className="grid sm:grid-cols-2 gap-4">{field('fullName','Full name',{maxLength:120,autoComplete:'name'})}{field('phone','Mobile number',{type:'tel',maxLength:20,autoComplete:'tel'})}{field('email','Email address',{type:'email',maxLength:254,autoComplete:'email'})}<div className="sm:col-span-2">{field('address','Delivery address',{maxLength:500,autoComplete:'street-address'})}</div>{field('city','City',{maxLength:100,autoComplete:'address-level2'})}{field('state','State',{maxLength:100,autoComplete:'address-level1'})}{field('pinCode','PIN code',{maxLength:12,autoComplete:'postal-code'})}</div><label className="block text-sm font-medium">Order notes (optional)<textarea value={form.customerNotes} onChange={e => setForm({...form,customerNotes:e.target.value})} className="textarea-field mt-1" maxLength={2000} /></label><p className="text-sm text-gray-600">Payment is arranged manually with CozyLoops through WhatsApp after placing your order.</p></section><aside className="lg:col-span-2 card-premium p-6 h-fit"><h2 className="font-semibold text-xl mb-4">Order summary</h2><div className="space-y-4">{cartItems.map(i => {const price=i.price*(1-(i.discount||0)/100);return <div className="flex gap-3" key={i._id}><img className="w-14 h-14 rounded object-cover" src={i.images?.[0]?.url} alt=""/><div className="flex-1"><div>{i.name}</div><div className="text-xs text-gray-500">SKU: {i.sku || '—'} · Qty {i.quantity}</div></div><b>₹{(price*i.quantity).toFixed(2)}</b></div>})}</div><div className="border-t mt-4 pt-4 space-y-2"><div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Delivery</span><span>Free</span></div><div className="flex justify-between text-lg font-bold"><span>Total</span><span>₹{cartTotal.toFixed(2)}</span></div></div><button disabled={busy} className="btn-primary w-full mt-5 disabled:opacity-50">{busy?'Placing order…':'Place order'}</button></aside></form></main>;
}
