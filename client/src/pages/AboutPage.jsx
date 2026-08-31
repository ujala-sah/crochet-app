export default function AboutPage() {
  const team = [
    {
      name: 'Ujala Sah',
      role: 'Founder & yarn florist',
      work: 'Designs the everlasting yarn bouquets and colour stories that open the catalogue — roses, peonies, and mixed garden wraps.',
      image: '/images/team-pos1.jpg',
    },
    {
      name: 'Priyanka Kumari Sah',
      role: 'Pattern author',
      work: 'Writes the stitch and wrapping notes for yarn stems, daisies, wreaths, and hand-tied bouquets so makers can recreate each bloom.',
      image: '/images/team-pos2.jpg',
    },
    {
      name: 'Shreya Pokharel',
      role: 'Studio stylist & photography',
      work: 'Lights and photographs every piece so the fibre, petal layers, and wrapping read clearly on the site.',
      image: '/images/team-pos3.jpg',
    },
    {
      name: 'Manisha Shah',
      role: 'Materials & finishing',
      work: 'Sources yarns, wires stems, and finishes gifts — boutonnieres, wreaths, and centrepieces — before they go into the collection.',
      image: '/images/team-pos4.jpg',
    },
  ];

  return (
    <div>
      <section className="yarn-ring">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">About Yarn-Tales</p>
          <h1 className="mt-2 font-display text-4xl text-ink-900 md:text-5xl">Stories told in yarn, not in water</h1>
          <p className="mt-5 leading-relaxed text-ink-700/90">
            Yarn-Tales is a catalogue of yarn botanicals: bouquets, single stems, bundles, wreaths, and small gifts that
            look gathered from a garden and are made entirely from fibre. Nothing wilts. Visitors browse the collection,
            search by name, and read how each piece is made. Members keep a simple account; only administrators tend the
            catalogue.
          </p>
          <p className="mt-4 leading-relaxed text-ink-700/90">
            We built the studio around four people who share the work — florist design, written patterns, photography, and
            finishing — so every listing feels like a shop window rather than a generic storefront.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-clay-600">The studio</p>
        <h2 className="mt-2 font-display text-3xl text-ink-900">Who makes Yarn-Tales</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <article key={person.name} className="card overflow-hidden">
              <img src={person.image} alt={person.name} className="h-52 w-full object-cover object-[center_12%]" />
              <div className="p-4">
                <h3 className="font-display text-xl text-ink-900">{person.name}</h3>
                <p className="mt-1 text-sm font-semibold text-clay-600">{person.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-700/85">{person.work}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
