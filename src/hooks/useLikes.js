import { useState, useCallback } from 'react';

const STORAGE_KEY = 'aura-likes';

function loadLikes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLikes(likes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(likes));
}

export function useLikes(initialLikes) {
  const [userLikes, setUserLikes] = useState(loadLikes);

  const isLiked = useCallback((id) => {
    return !!userLikes[id];
  }, [userLikes]);

  const getCount = useCallback((id, initialCount) => {
    const diff = userLikes[id] ? 1 : 0;
    return initialCount + diff;
  }, [userLikes]);

  const toggleLike = useCallback((id) => {
    setUserLikes(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      saveLikes(next);
      return next;
    });
  }, []);

  return { isLiked, getCount, toggleLike };
}
