export interface IBooklistFilter {
  rating: {
    id: string;
    starsNumber: number;
  }[];
  genres: {
    text: string;
  }[];
  year: {
    num: number;
  }[];
}
