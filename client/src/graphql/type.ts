export type QueryHookResult<T> = {
  data?: T;
  loading: boolean;
  refetch?: () => void;
};

export type User = {
  _id: string;
  name: string;
  email: string;
};

export type FileModel = {
  _id: string;
  user: string;
  name: string;
  tags: Tag[];
  public: boolean;
  url: string;
  publicUrl: string;
};

export type Tag = {
  _id: string;
  name: string;
};
