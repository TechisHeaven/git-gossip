import { UserInterface } from "./auth.type";

export type RepositoryType = {
  id: string;
  owner: {
    avatar_url: string;
    html_url: string;
    login: string;
  };
  name: string;
  html_url: string;
  updated_at: string;
  full_name: string;
};

export type MainRepositoryType = {
  id: string;
  owner: {
    avatar_url: string;
    html_url: string;
    login: string;
  };
  name: string;
  html_url: string;
  updated_at: string;
  full_name: string;
  contents_url: string;
  url: string;
};

interface currentSelectedRoomInterface {
  id: string;
}

export type currentSelectedRoomType = currentSelectedRoomInterface | null;

export interface ChatContentInterface {
  id: string | undefined;
  user: UserInterface | null;
}

export interface InteractionItemsInterface {
  title: string;
  icon: React.ReactNode;
  callback: () => void;
}
