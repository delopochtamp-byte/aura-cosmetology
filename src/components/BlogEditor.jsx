import { useState, useRef } from 'react';

export default function BlogEditor({ onPublish, onClose, t }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => URL.createObjectURL(file));
    setMedia(prev => [...prev, ...newMedia].slice(0, 10));
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = (index) => {
    setMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !text.trim()) return;
    onPublish({
      title: title.trim(),
      text: text.trim(),
      media,
      video: videoPreview,
    });
  };

  const canPublish = title.trim() && text.trim();

  return (
    <div className="blog-editor-overlay" onClick={onClose}>
      <div className="blog-editor" onClick={e => e.stopPropagation()}>
        <div className="blog-editor-header">
          <button className="blog-editor-cancel" onClick={onClose}>
            {t('site.cancel') || 'Отмена'}
          </button>
          <h2>{t('site.blog_new_post') || 'Новый пост'}</h2>
          <button
            className="blog-editor-publish"
            disabled={!canPublish}
            onClick={handleSubmit}
          >
            {t('site.blog_publish') || 'Опубликовать'}
          </button>
        </div>

        <div className="blog-editor-body">
          {/* Заголовок */}
          <input
            type="text"
            placeholder={t('site.blog_editor_title') || 'Заголовок'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />

          {/* Текст */}
          <textarea
            placeholder={t('site.blog_editor_text') || 'Текст поста...'}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={6}
          />

          {/* Фото */}
          <div className="blog-editor-upload-area" onClick={() => photoInputRef.current?.click()}>
            <div className="blog-editor-upload-icon">🖼️</div>
            <p>{t('site.blog_editor_photo') || 'Добавить фото (до 10)'}</p>
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} />

          {media.length > 0 && (
            <div className="blog-editor-photo-grid">
              {media.map((src, i) => (
                <div key={i} className="blog-editor-photo-item">
                  <img src={src} alt="" />
                  <button className="blog-editor-photo-remove" onClick={() => removeMedia(i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Видео */}
          <div className="blog-editor-upload-area" onClick={() => videoInputRef.current?.click()}>
            <div className="blog-editor-upload-icon">🎬</div>
            <p>{t('site.blog_editor_video') || 'Добавить видео (1)'}</p>
          </div>
          <input ref={videoInputRef} type="file" accept="video/*" hidden onChange={handleVideoUpload} />

          {videoPreview && (
            <div className="blog-editor-video-preview">
              <video src={videoPreview} controls />
              <button className="blog-editor-video-remove" onClick={() => { URL.revokeObjectURL(videoPreview); setVideoPreview(null); }}>✕</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
