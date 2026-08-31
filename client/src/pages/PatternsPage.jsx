import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import PatternCard from "../components/PatternCard.jsx";
import SkeletonGrid from "../components/SkeletonGrid.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function PatternsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setQuery(name), 250);
    return () => clearTimeout(timer);
  }, [name]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (query) params.set("name", query);
        if (category) params.set("category", category);
        if (difficulty) params.set("difficulty", difficulty);
        const qs = params.toString();
        const data = await api(`/patterns${qs ? `?${qs}` : ""}`);
        setItems(data.patterns);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query, category, difficulty]);

  function reset() {
    setName("");
    setQuery("");
    setCategory("");
    setDifficulty("");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink-900">Yarn patterns</h1>
      <p className="mt-2 max-w-2xl text-ink-700/80">
        Written notes for yarn flowers, bouquets, wreaths, and related fibre
        work.
      </p>

      <form
        className="mt-8 grid gap-3 rounded-2xl bg-white p-4 shadow-soft md:grid-cols-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <label className="sr-only" htmlFor="pattern-search">
          Search yarn patterns
        </label>
        <input
          id="pattern-search"
          className="input md:col-span-2"
          placeholder="Search yarn patterns..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {["Yarn Flowers", "Home", "Blankets", "Bouquets"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
        >
          <option value="">All levels</option>
          {["Beginner", "Easy", "Intermediate", "Advanced"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn-secondary md:col-span-4"
          onClick={reset}
        >
          Reset filters
        </button>
      </form>

      <div className="mt-10">
        {loading ? (
          <SkeletonGrid count={8} columns={4} />
        ) : error ? (
          <p className="rounded-2xl bg-red-50 p-4 text-red-800">{error}</p>
        ) : items.length === 0 ? (
          <EmptyState
            title="No yarn patterns found."
            message="Adjust the name, difficulty, or category to continue exploring."
            actionLabel="Reset search"
            onAction={reset}
          />
        ) : (
          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((pattern) => (
              <PatternCard key={pattern._id} pattern={pattern} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
