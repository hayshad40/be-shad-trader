# Security Specification: Be Shad Trader SaaS

## 1. Data Invariants
1. A user document `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId` or an admin (`hayshad40@gmail.com`).
2. Users cannot elevate their own role to `SUPER_ADMIN` or modify administrative RBAC fields without authorization.
3. Every operational document (product, customer, supplier, order, expense, warehouse) must have a valid `tenantId` (non-empty string <= 128 characters).
4. Sales orders cannot be updated once in terminal status (`delivered`, `cancelled`) except by an admin.
5. All document IDs must conform to `^[a-zA-Z0-9_\-]+$` and have size <= 128.
6. Writes require an authenticated user (`request.auth != null`).

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Order Injection**: Attempting to write an order with `request.auth == null` -> DENIED.
2. **Path ID Poisoning**: Attempting to create an order with document ID exceeding 128 chars or illegal characters -> DENIED.
3. **Role Escalation Attack**: Normal user attempting to write `role: "SUPER_ADMIN"` to their own user profile -> DENIED.
4. **Shadow Field Attack**: Order payload containing unauthorized ghost fields like `{ isFreeOrder: true }` -> DENIED.
5. **Terminal State Bypass**: Attempting to edit a 'delivered' order back to 'pending' -> DENIED.
6. **Cross-Tenant Product Tampering**: User attempting to modify product belonging to a different tenant -> DENIED.
7. **Negative Price Exploit**: Creating a product with `salePrice: -500` -> DENIED.
8. **Customer Balance Manipulation**: Direct client-side arbitrary balance override -> DENIED.
9. **Email Spoofing**: Writing as admin with an unverified email token -> DENIED.
10. **Orphaned Order**: Creating an order without a required `tenantId` or `customerId` -> DENIED.
11. **Immortal Field Mutation**: Attempting to alter `createdAt` on an existing order -> DENIED.
12. **Blanket Query Scraping**: Attempting an unbounded collection query without authentication -> DENIED.

## 3. Test Runner
See `firestore.rules` validation rules protecting all entities.
