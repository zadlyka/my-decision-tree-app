// src/@types/ml-cart.d.ts

declare module "ml-cart" {
  export class DecisionTreeClassifier {
    constructor();
    train(X: number[][], y: number[]): void;
    predict(X: number[][]): number[];
  }
}
