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
