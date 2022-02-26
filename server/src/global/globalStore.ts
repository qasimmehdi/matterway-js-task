export default class GlobalStore {
  private static instance: GlobalStore;
  private data: object = {};

  private constructor() {}

  public static getInstance(): GlobalStore {
    if (!GlobalStore.instance) {
      GlobalStore.instance = new GlobalStore();
    }

    return GlobalStore.instance;
  }

  public set(key: string, value: any): void {
    this.data[key] = value;
  }

  public get(key: string): any {
    return this.data[key];
  }
}
