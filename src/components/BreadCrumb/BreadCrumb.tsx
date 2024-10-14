const Breadcrumb = ({ currentPath }: { currentPath: string[] }) => {
  console.log(currentPath);
  return (
    <nav className="breadcrumb">
      {currentPath.map((folder, index) => (
        <span key={index}>
          {folder}
          {index < currentPath.length - 1 && " > "}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;