import React from 'react';
import { Helmet } from 'react-helmet-async';

const sections = [
  ['Information we collect', 'When you place an order, the checkout asks for your name, phone number, email address and delivery address (including city, state and postal code). You may also provide an optional order note. The site stores cart and wishlist details in your browser. Order tracking uses an access token saved in your browser so you can retrieve orders placed on that device.'],
  ['How we use information', 'Cozy.loopsss_ uses order details to receive and prepare orders, arrange delivery, contact you about an order and provide order tracking. The owner may use order records to manage inventory and answer customer support requests.'],
  ['Service providers', 'The application uses MongoDB Atlas to store application records, Cloudinary to store product and category images, Render to host the backend and Vercel to host the frontend. Payment is arranged manually: after checkout, the site can open WhatsApp with an order message so you can ask the owner for UPI details or a QR code. The site does not currently take payment through an integrated payment gateway. Those services may process technical information when you use them under their own terms and privacy notices.'],
  ['Cookies, browser storage and analytics', 'The frontend uses browser local storage for cart and wishlist contents and for the order tracking token. The reviewed application source does not include an analytics or advertising cookie integration. Your browser or hosting providers may separately process technical logs.'],
  ['Security and retention', 'Access to admin functions is protected by the site’s owner authentication. No online service can guarantee absolute security. Order records are retained in the store database for order management; the store has not published a specific deletion schedule. Please contact the owner to ask about a particular record.'],
  ['Your choices and questions', 'You can ask the owner to provide, correct or delete personal information, subject to records needed to manage completed orders. You can clear locally stored cart, wishlist and order tracking information by clearing this site’s browser storage; this does not delete order records held by the store. For privacy questions or requests, contact cozyloopsss21@gmail.com.'],
];

export default function PrivacyPolicyPage() {
  return <>
    <Helmet><title>Privacy Policy - cozy.loopsss_</title><meta name="description" content="How cozy.loopsss_ uses order and browser information." /></Helmet>
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-secondary-gray pb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-darkPink">cozy.loopsss_</p>
        <h1 className="font-display text-3xl font-bold leading-relaxed text-secondary-dark sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-secondary-dark/75">This page describes the information used by the current website. Please contact the store with privacy questions.</p>
      </header>
      <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
        <strong>Owner review before publication:</strong> confirm the data retention period, customer request process and the email address above before treating this page as final policy.
      </div>
      <div className="space-y-6">
        {sections.map(([title, content]) => <section key={title} className="rounded-2xl border border-secondary-gray bg-white p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold text-secondary-dark">{title}</h2>
          <p className="mt-3 leading-7 text-secondary-dark/80">{content}</p>
        </section>)}
      </div>
    </main>
  </>;
}
