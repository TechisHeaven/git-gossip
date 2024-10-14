const CodeViewer = ({ rawData }: { rawData: string }) => {
  // Your raw text data
  const lines = rawData.split("\n");
  return (
    <div
      className="p-4 bg-mainBackgroundColor text-white w-full"
      style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}
    >
      <pre className="border p-4 rounded-md overflow-x-auto">
        {lines.map((line, index) => (
          <div key={index}>
            <span style={{ opacity: 0.5, marginRight: "10px" }}>
              {index + 1}
            </span>
            {line}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default CodeViewer;
