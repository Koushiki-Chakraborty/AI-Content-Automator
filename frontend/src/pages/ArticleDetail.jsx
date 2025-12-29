import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { fetchArticleById } from "../services/api";
import Layout from "../components/Layout";
import { format } from "date-fns";

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const initialVersion = location.state?.version || "ai";
  const [showAiVersion, setShowAiVersion] = useState(initialVersion === "ai");
  const navigate = useNavigate();

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          Loading content...
        </div>
      </Layout>
    );
  }

  if (error || !article) {
    return (
      <Layout>
        <div style={{ textAlign: "center", padding: "4rem" }}>
          <p style={{ color: "red" }}>{error || "Article not found"}</p>
          <Link to="/" className="btn" style={{ marginTop: "1rem" }}>
            Back to Articles
          </Link>
        </div>
      </Layout>
    );
  }

  const isAiImproved = article.isUpdated;

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <Link to="/" style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            &larr; Back to List
          </Link>
        </div>

        <header
          style={{
            marginBottom: "2rem",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            <span
              className={`badge ${
                showAiVersion && isAiImproved ? "badge-ai" : "badge-original"
              }`}
            >
              {showAiVersion && isAiImproved
                ? "AI Version"
                : "Original Version"}
            </span>
            {showAiVersion && article.updatedAt && (
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  alignSelf: "center",
                }}
              >
                {article.updatedAt
                  ? format(new Date(article.updatedAt), "MMMM d, yyyy")
                  : ""}
              </span>
            )}
          </div>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              lineHeight: 1.2,
              margin: "0.5rem 0",
            }}
          >
            {article.title}
          </h1>
        </header>

        {isAiImproved && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            <button
              onClick={() => {
                setShowAiVersion(true);
                navigate(location.pathname, { state: { version: "ai" } });
              }}
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
              onClick={() => {
                setShowAiVersion(false);
                navigate(location.pathname, { state: { version: "original" } });
              }}
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

        <section style={{ marginBottom: "3rem" }}>
          <h2
            style={{
              fontSize: "1.75rem",
              fontWeight: "bold",
              color: showAiVersion ? "var(--primary-color)" : "#374151",
              marginBottom: "1rem",
            }}
          >
            {showAiVersion ? "AI-Improved Version" : "Original Version"}
          </h2>

          <article
            className="prose"
            style={{ lineHeight: 1.8, fontSize: "1.125rem" }}
          >
            <Markdown>
              {showAiVersion && isAiImproved
                ? article.content
                : article.originalContent || article.content}
            </Markdown>
          </article>
          {showAiVersion &&
            article.references &&
            article.references.length > 0 && (
              <div className="references-section">
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Sources & Research
                </h4>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {article.references.map((link, index) => (
                    <a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="reference-link"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </section>
      </div>
    </Layout>
  );
};

export default ArticleDetail;
