export interface IQuote {
  id: string;
  text: string;
  author: string;
}

export interface IQuoteResult {
  isSuccessfull: boolean;
  message: string;
}
