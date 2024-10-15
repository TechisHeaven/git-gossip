// import ReactMarkdown from "react-markdown";
import ReactMarkdown from "react-markdown";
import { fileDataType } from "../../pages/RepositoriesDashboard";

const CodeViewer = ({ content, name }: fileDataType) => {
  // Your raw text data
  const lines = content.split("\n");

  // Check if the file is README.md
  const isMarkdown = /\.md$/.test(name);
  const isUnsupportedFile = /\.(jpg|jpeg|png|gif|zip|pdf)$/i.test(name);

  if (isUnsupportedFile) {
    return <div>Unsupported file type. Cannot open this file.</div>;
  }

  return (
    <div
      className={`p-4 w-full`}
      style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
    >
      <h6 className="text-base font-semibold p-2">{name}</h6>
      <pre className="border border-gray-600 p-4 rounded-md overflow-x-auto">
        {isMarkdown ? (
          // For markdown files, use ReactMarkdown and display line numbers
          <div className="markdown-body prose dark:prose-invert lg:prose-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          // For non-markdown files, just render the text with line numbers
          lines.map((line, index) => (
            <div key={index} style={{ display: "flex" }}>
              <span style={{ opacity: 0.5, marginRight: "10px" }}>
                {index + 1}
              </span>
              {line}
            </div>
          ))
        )}
      </pre>
    </div>
  );
};

export default CodeViewer;
