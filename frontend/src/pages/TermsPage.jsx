import React from 'react';
import { Helmet } from 'react-helmet-async';

const sections = [
  ['Using this website', 'Use the website lawfully and provide accurate contact and delivery information when placing an order. The store may update these terms as its services change.'],
  ['Products, availability and prices', 'Product descriptions, images, materials, dimensions, availability and prices are shown on the product pages and may be updated. Handmade items may have small variations. The checkout total is the amount shown before you submit the order. An order request is subject to product availability and confirmation by the store.'],
  ['Orders and payment', 'The website submits an order request and shows an order confirmation when the server accepts it. The current checkout does not collect online payment. Payment is arranged manually through WhatsApp; the owner shares UPI details or a QR code after the order is placed. Payment remains pending until the owner verifies receipt. Do not treat a payment message as verification by the store.'],
  ['Delivery', 'The checkout currently displays delivery as free, and product pages may show an estimated delivery time. Actual coverage, timing and any exceptions must be confirmed with the store before publication of these terms. Delivery can be affected by product preparation and carrier conditions.'],
  ['Cancellations, returns and refunds', 'The website lets the owner manage order status and record payment refunds after verification. It does not publish a customer return window, cancellation deadline or automatic refund guarantee. Contact the store promptly at cozyloopsss21@gmail.com or through the listed WhatsApp contact to request a cancellation, return or refund. The owner will confirm the applicable arrangement before proceeding. A paid order must be refunded before the system permits the owner to cancel it.'],
  ['Intellectual property', 'The site’s brand, written material, photographs and other content belong to the store or their respective rights holders. Do not reuse them commercially without permission.'],
  ['Liability and changes', 'The store aims to keep product and order information accurate but cannot guarantee uninterrupted access or that every listing is error-free. To the extent permitted by applicable law, the store is not responsible for indirect loss arising from use of the website. Nothing here limits rights that cannot legally be limited. Updated terms apply when posted; review them when placing a new order.'],
  ['Contact', 'For questions about an order or these terms, contact cozyloopsss21@gmail.com or use the contact details shown on the website.'],
];

export default function TermsPage() {
  return <>
    <Helmet><title>Terms &amp; Conditions - cozy.loopsss_</title><meta name="description" content="Terms for ordering handmade crochet products from cozy.loopsss_." /></Helmet>
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 border-b border-secondary-gray pb-6">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary-darkPink">cozy.loopsss_</p>
        <h1 className="font-display text-3xl font-bold leading-relaxed text-secondary-dark sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-secondary-dark/75">Please read these terms before placing an order.</p>
      </header>
      <div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
        <strong>Owner review before publication:</strong> confirm delivery coverage and charges, order acceptance, cancellation and return arrangements, payment wording, contact details and applicable business/legal information. This page is informational and is not a legal compliance certification.
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
