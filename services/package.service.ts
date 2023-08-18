import { Transaction } from 'sequelize';
import { sequelizeConnection } from '../db/config'
import {Package} from '../models/package';
import { Price } from '../models/price';

export default {
  async getAll() {
    return await Package.findAll({
			include: [
				{model: Price, as: 'prices'},
			],
		});
  },
  async updatePackagePrice(pack: Package, newPriceCents: number, municipality?: string, date?: Date) {
    try {
      const newPackage = await sequelizeConnection.transaction(async t => {
        await Price.create({
          packageId: pack.id,
          priceCents: pack.priceCents,
          municipality: pack.municipality,
          ...date && {createdAt: date}
        }, { transaction: t });

        pack.priceCents = newPriceCents;
        if (municipality) {
          pack.municipality = municipality;
        }

        return pack.save({ transaction: t });
      });

      return newPackage;
    } catch (err: unknown) {
      throw new Error('Error handling the transaction');
    }
  },
	async priceFor(municipality: string) {
      const pack = await Package.findOne({where: {municipality}})
		  return pack?.priceCents;
	},
};
