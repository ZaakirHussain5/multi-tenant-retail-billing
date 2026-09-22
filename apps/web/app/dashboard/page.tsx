const metrics = [
  ["Sales today", "₹0.00"],
  ["Invoices", "0"],
  ["Gross profit", "₹0.00"],
  ["Low-stock items", "0"],
] as const;

export default function DashboardPage() {
  return (
    <main className="dashboard-shell">
      <header>
        <div>
          <span className="eyebrow">Demo Retail</span>
          <h1>Operations dashboard</h1>
        </div>
        <a href="/pos">Open POS</a>
      </header>
      <section className="metric-grid">
        {metrics.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
      <section className="dashboard-grid">
        <article>
          <h2>Sales trend</h2>
          <div className="chart-placeholder">Reporting projection ready</div>
        </article>
        <article>
          <h2>Inventory attention</h2>
          <p>No low-stock products.</p>
        </article>
      </section>
    </main>
  );
}
