export class AppError implements Error {
  name: string;
  stack?: string;
  message: string;
  msgParams: Record<string, string | number | boolean>;

  constructor(
    name: string,
    msgParams?: Record<string, string | number | boolean>,
  ) {
    this.name = name;
    this.msgParams = msgParams;
  }
}
