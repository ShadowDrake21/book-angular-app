import { IBooklistFilter } from '../models/booklist-filter.model';

export const BooklistFilterContent: IBooklistFilter = {
  rating: [
    { id: 'fiveStars', starsNumber: 5 },
    { id: 'fourStars', starsNumber: 4 },
    { id: 'threeStars', starsNumber: 3 },
    { id: 'twoStars', starsNumber: 2 },
    { id: 'oneStar', starsNumber: 1 },
  ],
  genres: [
    {
      text: 'drama',
    },
    {
      text: 'children',
    },
    {
      text: 'adventure',
    },
    {
      text: 'fiction',
    },
    {
      text: 'classic literature',
    },
    { text: 'fantasy' },
    { text: 'history' },
    { text: 'animals' },
    { text: 'love' },
    { text: 'war' },
    { text: 'death' },
    { text: 'comedy' },
  ],
  year: [
    { num: 2024 },
    { num: 2023 },
    { num: 2022 },
    { num: 2021 },
    { num: 2020 },
    { num: 2019 },
  ],
};
