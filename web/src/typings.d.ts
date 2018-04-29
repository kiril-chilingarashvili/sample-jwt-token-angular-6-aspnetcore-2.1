/* SystemJS module definition */
/// <reference path="../node_modules/zone.js/dist/zone.js.d.ts" />
declare var module: NodeModule;
interface NodeModule {
  id: string;
}
declare module "*.json" {
  const value: any;
  export default value;
}
