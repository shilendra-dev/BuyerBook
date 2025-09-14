export class BuyerNotFoundError extends Error {
  constructor(buyerId: string) {
    super(`Buyer with id ${buyerId} not found`);
    this.name = "BuyerNotFoundError";
  }
}

export class ConcurrencyError extends Error {
  constructor(message: string = "Record was modified by another user") {
    super(message);
    this.name = "ConcurrencyError";
  }
}
