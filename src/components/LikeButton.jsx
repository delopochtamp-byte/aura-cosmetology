import { useState } from 'react';

export default function LikeButton({ isLiked, count, onToggle }) {
  const [animating, setAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnimating(true);
    onToggle();
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      className={`like-btn ${isLiked ? 'liked' : ''} ${animating ? 'like-anim' : ''}`}
      onClick={handleClick}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <svg className="like-icon" width="24" height="24" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'}>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {count > 0 && <span className="like-count">{count}</span>}
    </button>
  );
}
