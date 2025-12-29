import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ArticleCard = ({ article }) => {
  const isUpdated = article.isUpdated;
  const [showAiVersion, setShowAiVersion] = useState(isUpdated);

  // Determine which content to show based on toggle
  const contentToShow = showAiVersion ? article.content : (article.originalContent || article.content);
  
  // Helper to truncate text
  const excerpt = contentToShow 
    ? contentToShow.substring(0, 150) + '...'
    : 'No content available.';

  return (
    <div style={{ 
      backgroundColor: 'var(--card-bg)', 
      borderRadius: '0.5rem', 
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          <Link to={`/article/${article._id}`} style={{ color: 'inherit' }}>
            {article.title}
          </Link>
        </h2>
        <span className={`badge ${showAiVersion ? 'badge-ai' : 'badge-original'}`}>
  {showAiVersion ? 'AI Version' : 'Original Version'}
</span>
      </div>

      {isUpdated && (
        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
          <button 
            onClick={() => setShowAiVersion(true)}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid',
              borderColor: showAiVersion ? 'var(--primary-color)' : '#e5e7eb',
              backgroundColor: showAiVersion ? 'var(--primary-color)' : 'transparent',
              color: showAiVersion ? 'white' : '#6b7280',
              cursor: 'pointer'
            }}
          >
            AI Version
          </button>
          <button 
             onClick={() => setShowAiVersion(false)}
             style={{
               padding: '0.25rem 0.75rem',
               borderRadius: '9999px',
               border: '1px solid',
               borderColor: !showAiVersion ? '#4b5563' : '#e5e7eb',
               backgroundColor: !showAiVersion ? '#4b5563' : 'transparent',
               color: !showAiVersion ? 'white' : '#6b7280',
               cursor: 'pointer'
             }}
          >
            Original
          </button>
        </div>
      )}
      
      <p style={{ color: '#4b5563', margin: 0, flex: 1 }}>
        {excerpt}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          {article.updated_at ? format(new Date(article.updated_at), 'MMM d, yyyy') : 'Unknown Date'}
        </span>
        <Link to={`/article/${article._id}`} state={{ version: showAiVersion ? 'ai' : 'original' }} className="btn">
          View Article
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
