export type RoomType = { id: string };
export type MessageType = {
  id: string | number;
  message: string;
  userId: string;
  timestamp: number;
};
export type SidebarProps = {
  isOpen: boolean;
  sidebar: "file_explorer" | "info" | null;
};

export type HoveredPathProps = hoveredPathTypes | null;

export type hoveredPathTypes = {
  id: number | string;
  path: string;
};
