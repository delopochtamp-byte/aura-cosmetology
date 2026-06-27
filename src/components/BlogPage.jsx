import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useLikes } from '../hooks/useLikes';
import { SEED_POSTS } from '../data/blogSeed';
import BlogCard from './BlogCard';
import BlogEditor from './BlogEditor';

const STORAGE_KEY = 'aura_blog_posts';

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Первый запуск — заполняем демо-постами
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function BlogPage({ showFavorites }) {
  const { t } = useTranslation();
  const { isLiked, getCount, toggleLike } = useLikes();
  const [posts, setPosts] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const handlePublish = (post) => {
    const updated = [{ ...post, id: Date.now(), date: new Date().toISOString() }, ...posts];
    setPosts(updated);
    savePosts(updated);
    setEditorOpen(false);
  };

  const handleLike = (postId) => {
    toggleLike(`blog_${postId}`);
  };

  const isPostLiked = (postId) => isLiked(`blog_${postId}`);
  const getPostCount = (postId) => getCount(`blog_${postId}`, 0);

  // Фильтрация по избранному
  const filteredPosts = useMemo(() => {
    if (!showFavorites) return posts;
    return posts.filter(post => isPostLiked(post.id));
  }, [posts, showFavorites, isPostLiked]);

  return (
    <div className="blog-page">
      {/* Header — без кнопки назад, переключатель в Header.jsx */}
      <div className="blog-header">
        <h1>{t('site.blog_title') || 'Блог'}</h1>
      </div>

      {/* Лента постов — карточки как в каталоге */}
      <div className="feed-scroll-container hide-scrollbar">
        {filteredPosts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">📝</div>
            <p>{showFavorites
              ? (t('site.favorites_empty') || 'В избранном нет постов')
              : (t('site.blog_empty') || 'В блоге пока нет постов')}</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              isLiked={isPostLiked}
              getCount={getPostCount}
              onToggleLike={handleLike}
              t={t}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <button className="blog-fab" onClick={() => setEditorOpen(true)} aria-label={t('site.blog_new_post') || 'Новый пост'}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {/* Editor */}
      {editorOpen && (
        <BlogEditor
          t={t}
          onPublish={handlePublish}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </div>
  );
}
