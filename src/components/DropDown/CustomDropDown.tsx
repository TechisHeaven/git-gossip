import { useEffect, useState } from "react";

const CustomDropdown = ({
  message,
  user,
  reference,
  onClose,
}: {
  message: string;
  user: { id: string; name: string; user_avatar: string };
  reference: React.RefObject<HTMLDivElement>;
  onClose: () => void;
}) => {
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    if (reference.current) {
      const rect = reference.current.getBoundingClientRect();
      const dropdownTop = rect.bottom + window.scrollY; // Position below the message
      setDropdownPosition({ top: dropdownTop, left: rect.left });
    }
  }, [reference]);

  return (
    <div
      className="absolute bg-mainBackgroundColor border border-gray-300 rounded shadow-lg"
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
      onClick={onClose}
    >
      <div className="p-2">
        <h6>User Details</h6>
        <p>Name: {user.name}</p>
        <p>Message: {message}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default CustomDropdown;
