export class GateWayError extends Error {
  code = -1;

  constructor(message: number) {
    super(message.toString());
    this.code = message;
  }

  public getErrorCode(): number {
    return this.code;
  }
}
