"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LineItem {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
}

export default function PosPage() {
  const [items, setItems] = useState<LineItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const scanInput = useRef<HTMLInputElement>(null);

  const focusScanner = useCallback(() => scanInput.current?.focus(), []);
  useEffect(focusScanner, [focusScanner]);

  const addScannedProduct = () => {
    const value = barcode.trim();
    if (!value) return;
    setItems((current) => {
      const existing = current.find((item) => item.barcode === value);
      if (existing) {
        return current.map((item) =>
          item.barcode === value
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...current,
        { barcode: value, name: value, price: 0, quantity: 1 },
      ];
    });
    setBarcode("");
    requestAnimationFrame(focusScanner);
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <main className="pos-shell" onClick={focusScanner}>
      <header className="pos-header">
        <div>
          <strong>RetailOS POS</strong>
          <span>Demo Store</span>
        </div>
        <div>
          <span>Cashier</span>
          <strong>Ready</strong>
        </div>
      </header>
      <section className="scan-panel">
        <label htmlFor="barcode">Scan barcode or search product</label>
        <input
          ref={scanInput}
          id="barcode"
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && addScannedProduct()}
          autoComplete="off"
        />
      </section>
      <section className="pos-grid">
        <div className="line-items">
          <div className="line-item heading">
            <span>Product</span>
            <span>Qty</span>
            <span>Total</span>
          </div>
          {items.length === 0 ? (
            <p className="empty">Scan an item to begin</p>
          ) : (
            items.map((item) => (
              <div className="line-item" key={item.barcode}>
                <span>
                  {item.name}
                  <small>{item.barcode}</small>
                </span>
                <strong>{item.quantity}</strong>
                <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))
          )}
        </div>
        <aside className="checkout-panel">
          <div>
            <span>Subtotal</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
          <div>
            <span>GST</span>
            <strong>₹0.00</strong>
          </div>
          <div className="grand-total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
          <button type="button">F8&nbsp;&nbsp;Take payment</button>
          <p>F2 Search · F4 Customer · F9 Hold · F10 Complete</p>
        </aside>
      </section>
    </main>
  );
}
