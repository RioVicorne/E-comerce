"use client";

import * as React from "react";

import {
  bentoCategories,
  products,
  promotions,
  quickAccess,
  type Product,
} from "@/lib/marketplace-data";
import { Navbar } from "@/components/marketplace/navbar";
import { Hero } from "@/components/marketplace/hero";
import { BentoGrid } from "@/components/marketplace/bento-grid";
import { QuickAccess } from "@/components/marketplace/quick-access";
import { ProductTabs } from "@/components/marketplace/product-tabs";
import {
  PaymentModal,
  type CheckoutOrder,
} from "@/components/marketplace/payment-modal";
import { CartSidebar } from "@/components/marketplace/cart-sidebar";

export default function HomePage() {
  const [cart, setCart] = React.useState<Array<{ product: Product; qty: number }>>(
    [],
  );
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<CheckoutOrder | null>(null);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  function openCheckoutWith(items: Array<{ product: Product; qty: number }>) {
    const total = items.reduce((sum, i) => sum + i.product.salePrice * i.qty, 0);
    const orderId = `KW-${new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "")}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;

    setActiveOrder({ orderId, items, total });
    setCheckoutOpen(true);
  }

  function addToCart(product: Product) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.product.id === product.id);
      if (idx === -1) return [...prev, { product, qty: 1 }];
      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
      return copy;
    });
  }

  function updateQuantity(productId: string, qty: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function handleCheckout() {
    if (cart.length > 0) {
      openCheckoutWith(cart);
    }
  }

  return (
    <div className="app-bg min-h-dvh overflow-x-hidden">
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-overlay opacity-25" />

      <Hero promotions={promotions} />
      <BentoGrid categories={[...bentoCategories]} />
      <QuickAccess items={[...quickAccess]} />

      <ProductTabs
        products={products}
        onBuyNow={(p) => {
          addToCart(p);
          openCheckoutWith([{ product: p, qty: 1 }]);
        }}
        onAddToCart={addToCart}
      />

      <CartSidebar
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      <PaymentModal
        open={checkoutOpen}
        onOpenChange={(open) => {
          setCheckoutOpen(open);
          if (!open) {
            // Reset order when modal closes
            setActiveOrder(null);
          }
        }}
        order={activeOrder}
        onPaymentSuccess={() => {
          // Clear cart after successful payment
          setCart([]);
          setCartOpen(false);
        }}
      />
    </div>
  );
}
