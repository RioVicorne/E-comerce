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
import { ProductListBox } from "@/components/marketplace/product-list-box";
import {
  PaymentModal,
  type CheckoutOrder,
} from "@/components/marketplace/payment-modal";
import { TopUpModal } from "@/components/marketplace/topup-modal";
import { CartSidebar } from "@/components/marketplace/cart-sidebar";
import { Footer } from "@/components/marketplace/footer";
import { TickerBanner } from "@/components/marketplace/ticker-banner";
import { ToastProvider, useToast } from "@/components/marketplace/toast";

function HomePageContent() {
  const [cart, setCart] = React.useState<Array<{ product: Product; qty: number }>>(
    [],
  );
  const [cartOpen, setCartOpen] = React.useState(false);
  const [checkoutOpen, setCheckoutOpen] = React.useState(false);
  const [activeOrder, setActiveOrder] = React.useState<CheckoutOrder | null>(null);
  const [topUpOpen, setTopUpOpen] = React.useState(false);
  const { showToast } = useToast();

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  // Listen for openCart event from toast
  React.useEffect(() => {
    const handleOpenCart = () => {
      setCartOpen(true);
    };
    window.addEventListener("openCart", handleOpenCart);
    return () => window.removeEventListener("openCart", handleOpenCart);
  }, []);

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
    // Show toast notification
    showToast(product);
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
      <TickerBanner />
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onTopUpClick={() => setTopUpOpen(true)}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] grid-overlay opacity-25" />

      <Hero promotions={promotions} />
      <BentoGrid categories={[...bentoCategories]} />
      <QuickAccess items={[...quickAccess]} />

      <ProductTabs
        products={products}
        onBuyNow={(p) => {
          // Direct checkout without adding to cart
          openCheckoutWith([{ product: p, qty: 1 }]);
        }}
        onAddToCart={addToCart}
      />

      <ProductListBox
        products={products}
        onBuyNow={(p) => {
          // Direct checkout without adding to cart
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
          // If checkout was from cart, clear cart
          // If direct buy, checkoutOpen handles itself
          // Simple heuristic: if order items match cart, clear cart
          // But for now, user request is simple: Buy Now -> Checkout.
          // IF we bought the cart, satisfy original logic:
          const isCartCheckout = cart.length > 0 && 
            JSON.stringify(cart) === JSON.stringify(activeOrder?.items);
          
          if (isCartCheckout) {
             setCart([]);
          }
          setCartOpen(false);
        }}
        onRequestTopUp={() => {
          setCheckoutOpen(false);
          // Small delay to allow modal to close smoothly before opening top-up
          setTimeout(() => setTopUpOpen(true), 150);
        }}
      />

      <TopUpModal 
        open={topUpOpen} 
        onOpenChange={(open) => {
          setTopUpOpen(open);
          // If we closed topup and have pending checkout order, check if we should reopen checkout
          // Logic: If we came from checkout (activeOrder exists) and now have enough balance?
          // The previous logic in PaymentModal was trying to reopen.
          // Let's keep it simple: if user tops up, they likely want to resume checkout if there was one.
          if (!open && activeOrder) {
             // We can reopen checkout to let user try paying again
             // But wait, does activeOrder persist? Yes state is here.
             setCheckoutOpen(true);
          }
        }} 
      />

      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <HomePageContent />
    </ToastProvider>
  );
}
