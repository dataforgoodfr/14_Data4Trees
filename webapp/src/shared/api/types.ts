type FilterLeaf<T> = {
  property_name: string;
  values: Array<T>;
};

export type Filters = {
  project: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
  };
  loc1: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
  };
};

export type APIError = {
  status: number;
  message: string;
  cause: string;
};
