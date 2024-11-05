import { FaRegFileAlt } from "react-icons/fa";

const Breadcrumb = ({ currentPath }: { currentPath: string[] }) => {
  return (
    <nav className="breadcrumb p-4 inline-flex items-center gap-2">
      <FaRegFileAlt className="text-sm" />
      <div>
        {currentPath.map((folder, index) => (
          <span
            key={index}
            className={
              currentPath.length - 1 === index ? "text-white" : "text-gray-600"
            }
          >
            {folder}
            {index < currentPath.length - 1 && "/"}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
