

export type ExConfig = {
  rpcUrl: string;
  secretKey: string;
};
export abstract class Ex {
  readonly exConfig: ExConfig;
  constructor(exConfig: ExConfig) {
    this.exConfig = exConfig;
  }
}
