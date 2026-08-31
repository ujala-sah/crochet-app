import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';

export default function PatternCard({ pattern }) {
  return (
    <article className="card group flex h-full flex-col self-stretch transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="h-56 shrink-0 overflow-hidden">
        <SmartImage
          src={pattern.image}
          alt={pattern.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="flex h-7 items-center justify-between gap-3">
          <span className="chip">{pattern.category}</span>
          <span className="text-xs font-semibold text-sage-600">{pattern.difficulty}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 h-14 font-display text-xl leading-7 text-ink-900">{pattern.name}</h3>
        <p className="mt-2 line-clamp-3 h-[4.5rem] text-sm leading-relaxed text-ink-700/80">
          {pattern.shortDescription || pattern.description?.slice(0, 120)}
        </p>
        <div className="mt-auto pt-4">
          <Link to={`/patterns/${pattern._id}`} className="btn-secondary flex h-11 w-full items-center justify-center">
            View Pattern
          </Link>
        </div>
      </div>
    </article>
  );
}
