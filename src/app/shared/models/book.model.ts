export interface Book {
  key: string;
  type: string;
  seed: string[];
  title: string;
  title_sort: string;
  title_suggest: string;
  edition_count: number;
  edition_key: string[];
  first_publish_year: number;
  number_of_pages_median: number;
  lccn: string[];
  publish_place: string[];
  contributor: string[];
  lcc: string[];
  ddc: string[];
  isbn: string[];
  has_fulltext: boolean;
  public_scan_b: boolean;
  ia: string[];
  ia_collection: string[];
  ia_collection_s: string;
  lending_edition_s: string;
  lending_identifier_s: string;
  printdisabled_s: string;
  ratings_average: number;
  ratings_sortable: number;
  ratings_count: number;
  ratings_count_1: number;
  ratings_count_2: number;
  ratings_count_3: number;
  ratings_count_4: number;
  ratings_count_5: number;
  readinglog_count: number;
  want_to_read_count: number;
  currently_reading_count: number;
  already_read_count: number;
  cover_edition_key: string;
  cover_i: number;
  first_sentence: string[];
  publisher: string[];
  language: string[];
  author_key: string[];
  author_name: string[];
  author_alternative_name: string[];
  person: string[];
  place: string[];
  subject: string[];
  time: string[];
  publisher_facet: string[];
  person_key: string[];
  place_key: string[];
  time_facet: string[];
  person_facet: string[];
  subject_facet: string[];
  _version_: number;
  place_facet: string[];
  lcc_sort: string;
  author_facet: string[];
  subject_key: string[];
  time_key: string[];
  ddc_sort: string;
  image: string;
}
