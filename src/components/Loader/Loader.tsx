interface LoaderInterface {
  size: "sm" | "md" | "lg" | "xl";
  color: "black" | "white";
}

const Loader = (props: LoaderInterface) => {
  const baseClasses = `border-gray-300 aspect-square animate-spin rounded-full ${
    props.color === "black" ? "border-t-black" : "border-t-white"
  }`;
  const sizeClasses = {
    sm: "h-6 w-6 border-4",
    md: "h-8 w-8 border-6",
    lg: "h-12 w-12 border-8",
    xl: "h-16 w-16 border-8",
  };

  const combinedClasses = [baseClasses, sizeClasses[props.size]].join(" ");

  return (
    <div className="w-full h-full grid  place-items-center">
      <span className={combinedClasses}></span>
    </div>
  );
};

export default Loader;
