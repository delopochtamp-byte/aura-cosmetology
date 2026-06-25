import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useLikes } from '../hooks/useLikes';
import BlogEditor from './BlogEditor';
import LikeButton from './LikeButton';

const STORAGE_KEY = 'aura_blog_posts';

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export default function BlogPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isLiked, getCount, toggleLike } = useLikes();
  const [posts, setPosts] = useState([]);
  const [editorOpen, setEditorOpen] = useState(false);
  const [flippedId, setFlippedId] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState({});

  useEffect(() => {
    setPosts(loadPosts());
  }, []);

  const handlePublish = (post) => {
    const updated = [{ ...post, id: Date.now(), date: new Date().toISOString() }, ...posts];
    setPosts(updated);
    savePosts(updated);
    setEditorOpen(false);
  };

  const handleFlip = (id) => {
    setFlippedId(prev => prev === id ? null : id);
  };

  const handleLike = (postId) => {
    toggleLike(`blog_${postId}`);
  };

  const isPostLiked = (postId) => isLiked(`blog_${postId}`);
  const getPostCount = (postId) => getCount(`blog_${postId}`, 0);

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('ru-RU', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="blog-page">
      {/* Header */}
      <div className="blog-header">
        <button className="blog-back-btn" onClick={() => navigate('/')}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 4L6 10L12 16" />
          </svg>
        </button>
        <h1>{t('site.blog_title') || 'Блог'}</h1>
      </div>

      {/* Лента постов */}
      <div className="blog-feed">
        {posts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">📝</div>
            <p>{t('site.blog_empty') || 'В блоге пока нет постов'}</p>
          </div>
        ) : (
          posts.map(post => {
            const hasMultipleMedia = post.media && post.media.length > 1;
            const currentIdx = carouselIdx[post.id] || 0;

            return (
              <div
                key={post.id}
                className={`blog-card${flippedId === post.id ? ' flipped' : ''}`}
                onClick={() => !hasMultipleMedia && handleFlip(post.id)}
              >
                <div className="blog-card-inner">
                  {/* Front */}
                  <div className="blog-card-front">
                    {post.media && post.media.length > 0 && (
                      <div className="blog-card-carousel">
                        <img src={post.media[currentIdx]} alt="" />
                        {hasMultipleMedia && (
                          <>
                            <div
                              style={{
                                position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                                width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', fontSize: 16, zIndex: 2
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCarouselIdx(prev => ({
                                  ...prev,
                                  [post.id]: currentIdx === 0 ? post.media.length - 1 : currentIdx - 1
                                }));
                              }}
                            >‹</div>
                            <div
                              style={{
                                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                                width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
                                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', fontSize: 16, zIndex: 2
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCarouselIdx(prev => ({
                                  ...prev,
                                  [post.id]: currentIdx === post.media.length - 1 ? 0 : currentIdx + 1
                                }));
                              }}
                            >›</div>
                          </>
                        )}
                        <div className="blog-card-carousel-dots">
                          {post.media.map((_, i) => (
                            <div key={i} className={`blog-card-carousel-dot${i === currentIdx ? ' active' : ''}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    {post.video && !post.media?.length && (
                      <video className="blog-card-video" src={post.video} muted loop playsInline />
                    )}
                    <div className="blog-card-info">
                      <span className="blog-card-title">{post.title}</span>
                      <span className="blog-card-date">{formatDate(post.date)}</span>
                    </div>
                    <div className="blog-card-like" style={{ position: 'absolute', bottom: 56, right: 12, zIndex: 3 }}>
                      <LikeButton
                        isLiked={isPostLiked(post.id)}
                        count={getPostCount(post.id)}
                        onToggle={(e) => { e?.stopPropagation?.(); handleLike(post.id); }}
                      />
                    </div>
                  </div>

                  {/* Back */}
                  <div className="blog-card-back" onClick={() => handleFlip(post.id)}>
                    <h2 className="blog-card-back-title">{post.title}</h2>
                    <div className="blog-card-back-date">{formatDate(post.date)}</div>
                    <div className="blog-card-back-text">{post.text}</div>
                  </div>
                </div>
              </div>
            );
          })
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
