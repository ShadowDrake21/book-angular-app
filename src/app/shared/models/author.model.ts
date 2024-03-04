export interface IAuthor {
  bio: string;
  remote_ids: ServicesIds;
  fuller_name: string;
  wikipedia: string;
  photos: number[];
  type: Type;
  personal_name: string;
  entity_type: string;
  alternate_names: string[];
  name: string;
  source_records: string[];
  links: Link[];
  title: string;
  key: string;
  birth_date: string;
  death_date: string;
  latest_revision: number;
  revision: number;
  created: Created;
  last_modified: LastModified;
  work_count: number;
}

export interface ServicesIds {
  viaf: string;
  goodreads: string;
  storygraph: string;
  librarything: string;
  wikidata: string;
  [key: string]: string;
}

export interface Bio {
  type: string;
  value: string;
}

export interface Type {
  key: string;
}

export interface Link {
  title: string;
  url: string;
  type: Type;
}

export interface Created {
  type: string;
  value: string;
}

export interface LastModified {
  type: string;
  value: string;
}

export interface IAuthorSearch {
  key: string;
  type: string;
  name: string;
  top_work: string;
  work_count: number;
  _version_: number;
}

export interface IRemoteIdsLinks {
  text: string;
  link: string;
}
