export interface IQuote {
  id: string;
  text: string;
  author: string;
  workTitle?: string;
}

export interface IQuoteResult {
  isSuccessfull: boolean;
  message: string;
}
