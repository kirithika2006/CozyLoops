# CozyLoops orders and inventory rollout

## What this adds

- Orders, order counters, and inventory movements are new Mongoose collections. Existing product documents remain readable: missing fulfillment fields behave as `READY_TO_SHIP`, with a low stock warning threshold of 3. No existing collections or records are reset.
- New endpoints are mounted at `/api/orders`. Creating an order trusts only MongoDB product prices, reserves ready-to-ship stock and writes the order/movement rows in one MongoDB transaction. The `X-Order-Access-Token` is a 256-bit customer tracking credential; only its SHA-256 hash is stored in MongoDB.
- Customer tracking credentials are saved in the browser's `cozyloops_orders` localStorage key. The order itself is permanently stored in MongoDB. Keep browser storage private; clearing it removes convenient tracking access, not the order.
- Payment stays `Unpaid` until an authenticated owner manually verifies the UPI payment in Admin → Orders. WhatsApp only opens a prefilled message. No gateway or payment credential is configured.

## Atlas requirement

Order placement and cancellation use MongoDB multi-document transactions. Confirm the Atlas deployment is a replica set (Atlas clusters are replica sets) and that the application database user can read/write the new collections. A standalone MongoDB server cannot safely run this order workflow; it will reject transactions. The app intentionally does not fall back to non-atomic stock updates.

Collections and indexes are created by Mongoose when the backend starts (`autoIndex` behavior depends on the current Mongoose environment/configuration). If production disables automatic index creation, create indexes through Atlas after deploying:

- `orders`: unique `orderId`, unique `accessTokenHash`, `createdAt`, customer email/date, status/payment/date.
- `ordercounters`: `_id` is the year key.
- `inventorymovements`: product/date and order/product/reason uniqueness.

Do not drop or recreate the existing database. Deploy backend first, then frontend. The first new order creates the order collections without touching existing product records.

## Deploy

No new environment variables are required. Keep the existing Render `MONGODB_URI`, `JWT_SECRET`, Cloudinary settings, and `FRONTEND_URL`; do not put backend secrets in Vercel variables. Preserve Vite's existing `VITE_API_URL` setting if the current deployment uses it. Set the Render service to the existing backend start command and redeploy; then deploy the Vercel frontend.

Admin order routes reuse the existing owner OTP/JWT middleware. Owner OTP delivery still depends on valid SMTP credentials configured separately; order administration requires a logged-in owner.

## Customer and owner flow

1. Set each new/admin-edited product to Ready to ship or Made to order. Ready-to-ship products decrement stock during checkout. Made-to-order products use the preparation time and do not decrement ordinary stock.
2. Add products to cart, then use Checkout. Shipping remains free, matching the current cart display.
3. After the database confirms the order, the confirmation page offers Continue to WhatsApp. The owner shares the UPI ID/QR and verifies the received payment independently.
4. In Admin → Orders, review the order, mark the payment paid only after verification, and advance its status. Cancelling an eligible unpaid order restores ready-to-ship stock once and records a movement.

The existing WhatsApp contact is centralized in `frontend/src/utils/constants.js` and retains the current number.

## Verification and limitations

- `node --check` passed on the new order controller/routes and modified backend product/app/model files.
- `npm run build` passed for the Vite frontend.
- API smoke checks passed: `/health` returned 200, an empty order request returned 400, and an unauthenticated admin summary request returned 401. These requests did not create an order or write to Atlas.
- No live order was written to the connected Atlas database. End-to-end order creation, race/oversell behavior, cancellation restoration, UPI message delivery, and authorized admin actions still need staging verification against a replica-set database with an owner OTP login. The existing owner SMTP configuration previously returned Gmail authentication error 535; admin order actions cannot be verified until the owner email provider accepts the configured SMTP credentials.
- Existing products default safely to ready-to-ship. Review inventory counts and choose Made to order where appropriate before accepting new orders; no bulk database migration is performed.


