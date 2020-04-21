export default class BasicStore {
  constructor(stores, storeName) {
    this._stores = stores
    this._storeName = storeName
  }

  getStore(storeName) {
    return this._stores[storeName]
  }

  get storeName() {
    return this._storeName
  }

  get constructorName() {
    return this.__proto__.constructor.name
  }
}
