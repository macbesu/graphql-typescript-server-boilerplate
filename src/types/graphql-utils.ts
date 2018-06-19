export interface ResolverMap {
  [key: String]: {
    [key: String]: (parent: any, args: any, context: {}, info: any) => any;
  }
}