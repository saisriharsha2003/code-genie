import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import gfm from "remark-gfm";
import { Copy } from "lucide-react";

const MessageRenderer = ({ message }) => {
  const components = {
    code({ inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className ?? "");

      if (inline || !match) {
        return (
          <code
            {...props}
            style={{
              backgroundColor: "#2d2d2d",
              padding: "2px 6px",
              borderRadius: "4px",
              color: "#00ffff",
              fontSize: "0.9rem",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              display: "inline",
              border: "1px solid #444", 
            }}
          >
            {String(children)}
          </code>
        );
      }

      return (
        <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #444" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#2d2d2d",
              padding: "8px 12px",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontFamily: "monospace",
              borderBottom: "1px solid #444"
            }}
          >
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>{match[1]}</span>
            <button
              onClick={() => navigator.clipboard.writeText(children)}
              style={{
                background: "#444",
                border: "none",
                color: "#00ffff",
                cursor: "pointer",
                fontSize: "0.85rem",
                padding: "4px 8px",
                borderRadius: "4px",
                transition: "background 0.3s",
                display: "flex",
                alignItems: "center"
              }}
              onMouseOver={(e) => (e.target.style.background = "#555")}
              onMouseOut={(e) => (e.target.style.background = "#444")}
            >
              <Copy size={16} />
            </button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
            customStyle={{ margin: 0, backgroundColor: "black", fontSize: "15px" }}
            codeTagProps={{
              style: { backgroundColor: "transparent" }, 
            }}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    pre({ children, ...props }) {
      return (
        <pre
          {...props}
          style={{
            backgroundColor: "black",
            borderRadius: "8px",
            overflowX: "auto",
            marginBottom: "16px",
            marginTop: "16px",
            border: "1px solid #00ffff",
            color: "#ffffff",
            fontFamily: "monospace",
          }}
        >
          {children}
        </pre>
      );
    },
    h1: ({ children }) => (
      <h1
        style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          color: "#00ffff",
          borderBottom: "2px solid #00ffff",
          paddingBottom: "8px",
          marginBottom: "12px",
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{
          fontSize: "1.75rem",
          fontWeight: "600",
          color: "#00ffff",
          borderBottom: "1px solid #00ffff",
          paddingBottom: "4px",
          marginTop: "16px",
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{
          fontSize: "1.5rem",
          fontWeight: "500",
          color: "#00ffff",
          marginTop: "12px",
        }}
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p style={{ color: "#d1d5db", lineHeight: "1.6", margin: "8px 0" }}>
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong style={{ fontWeight: "600", color: "#00ffff" }}>
        {children}
      </strong>
    ),
    ul: ({ children }) => (
      <ul
        style={{
          listStyleType: "disc",
          paddingLeft: "20px",
          color: "#d1d5db",
          marginTop: "10px",
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol
        style={{
          listStyleType: "decimal",
          paddingLeft: "32px",
          color: "#d1d5db",
        }}
      >
        {children}
      </ol>
    ),
    li: ({ children }) => <li style={{ color: "#d1d5db" }}>{children}</li>,
    blockquote: ({ children }) => (
      <blockquote
        style={{
          borderLeft: "4px solid #00ffff",
          paddingLeft: "16px",
          fontStyle: "italic",
          color: "#d1d5db",
          margin: "16px 0",
        }}
      >
        {children}
      </blockquote>
    ),
  };

  return (
    <div className="space-y-6 p-6 bg-gray-900 rounded-2xl shadow-xl border border-cyan-500 text-white transition-all duration-300 hover:shadow-2xl">
      <ReactMarkdown components={components} remarkPlugins={[gfm]}>
        {message}
      </ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
