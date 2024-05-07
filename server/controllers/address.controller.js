const AddressService = require("../services/address.service");

class AddressController {
  static async createAddress(req, res) {
    const addressData = req.body;
    try {
      const createdAddress = await AddressService.createAddress(addressData);
      res.status(201).json(createdAddress);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAddress(req, res) {
    try {
      const { address } = req.query || {};

      if (!address) throw new Error("Address is required");

      const addressFound = await AddressService.getAddress({ address });
      res.status(200).json(addressFound);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = AddressController;
