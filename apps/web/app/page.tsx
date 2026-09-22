const foundations = [
  "Tenant isolation with PostgreSQL RLS",
  "Atomic billing and inventory transactions",
  "Keyboard-first POS and HID barcode support",
  "GST-ready decimal-safe tax engine",
];

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">RetailOS Foundation</span>
          <h1>Fast billing. Accurate stock. Clean tenant boundaries.</h1>
          <p>
            The TypeScript foundation is running. Feature modules will land as
            independently reviewable pull requests.
          </p>
          <a href="http://localhost:4000/api/v1/health">Check API health</a>
        </div>
        <aside>
          <h2>Engineering priorities</h2>
          <ul>
            {foundations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
