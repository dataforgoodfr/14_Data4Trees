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
  loc2: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
    enquete: FilterLeaf<string>;
  };
  type: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
  };
  cohort: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
  };
  ecos: {
    inventaire_for: FilterLeaf<number>;
    inventaire_bio: FilterLeaf<number>;
  };
  year: {
    inventaire_for: FilterLeaf<string>;
    inventaire_bio: FilterLeaf<string>;
    enquete: FilterLeaf<string>;
  };
};

export type APIError = {
  status: number;
  message: string;
  cause: string;
};
