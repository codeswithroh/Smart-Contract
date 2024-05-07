const Address = require("../models/address.model");

class AddressService {
  static async createAddress(addressData) {
    const createdAddress = await Address.create(addressData);
    return createdAddress;
  }

  static async getAddress({ address }) {
    const foundAddress = await Address.findOne({ address });

    return !!foundAddress;
  }
}

module.exports = AddressService;
