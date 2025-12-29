import React, { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./ArticleCard.css";
import ReactMarkdown from "react-markdown";

const ArticleCard = ({ article }) => {
  const isUpdated = article.isUpdated;
  const [showAiVersion, setShowAiVersion] = useState(isUpdated);

  const contentToShow = showAiVersion
    ? article.content
    : article.originalContent || article.content;

  const excerpt = contentToShow
    ? contentToShow.replace(/[#*`]/g, "").substring(0, 150) + "..."
    : "No content available.";

  return (
    <div
      className="article-card"
      style={{
        backgroundColor: "var(--card-bg)",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          minHeight: "4rem",
        }}
      >
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            margin: 0,
            paddingRight: "10px",
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          <Link
            to={`/article/${article._id}`}
            state={{ version: showAiVersion ? "ai" : "original" }}
            className="article-title"
          >
            {article.title}
          </Link>
        </h2>
        <span
          className={`badge ${showAiVersion ? "badge-ai" : "badge-original"}`}
        >
          {showAiVersion ? "AI Version" : "Original Version"}
        </span>
      </div>

      {isUpdated && (
        <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem" }}>
          <button
            onClick={() => setShowAiVersion(true)}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid",
              borderColor: showAiVersion ? "var(--primary-color)" : "#e5e7eb",
              backgroundColor: showAiVersion
                ? "var(--primary-color)"
                : "transparent",
              color: showAiVersion ? "white" : "#6b7280",
              cursor: "pointer",
            }}
          >
            AI Version
          </button>
          <button
            onClick={() => setShowAiVersion(false)}
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              border: "1px solid",
              borderColor: !showAiVersion ? "#4b5563" : "#e5e7eb",
              backgroundColor: !showAiVersion ? "#4b5563" : "transparent",
              color: !showAiVersion ? "white" : "#6b7280",
              cursor: "pointer",
            }}
          >
            Original
          </button>
        </div>
      )}

      <p style={{ color: "#4b5563", margin: 0, flex: 1 }}>{excerpt}</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "auto",
        }}
      >
        <Link
          to={`/article/${article._id}`}
          state={{ version: showAiVersion ? "ai" : "original" }}
          className="btn"
          style={{ marginLeft: "auto" }}
        >
          View Article
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
