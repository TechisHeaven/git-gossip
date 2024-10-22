import { InteractionItemsInterface } from "../../types/repositories.type";

const InteractionItems = ({
  title,
  icon,
  callback,
}: InteractionItemsInterface) => {
  return (
    <button
      onClick={callback}
      className="item inline-flex capitalize rounded-md justify-between items-center py-2 p-1 hover:text-black hover:bg-gray-100 transition-colors"
    >
      <p className="text-sm">{title}</p>
      {icon}
    </button>
  );
};

export default InteractionItems;
