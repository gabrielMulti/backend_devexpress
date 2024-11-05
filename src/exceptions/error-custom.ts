export class CustomError extends Error {
  code: number;

  constructor(params: { message: string; code: number }) {
    super(params.message);
    this.code = params.code;
  }
}
