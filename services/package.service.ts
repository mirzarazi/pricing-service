import { Transaction, Op } from 'sequelize';
import { sequelizeConnection } from '../db/config'
import { Municipality } from '../models/municipality';
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
  async findMunicipalityByName(name:string, transaction: Transaction): Promise<Municipality | null> {
    return Municipality.findOne({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      transaction
    });
  },
  async updatePackagePrice(pack: Package, newPriceCents: number, municipalityName?: string, date?: Date) {
    try {
      const newPackage = await sequelizeConnection.transaction(async t => {
        let municipality: Municipality | null = null;
        if (municipalityName) {
          municipality = await this.findMunicipalityByName(municipalityName, t);
        }
        await Price.create({
          packageId: pack.id,
          priceCents: pack.priceCents,
          ...municipality && {municipalityId: municipality.id},
          ...date && {createdAt: date}
        }, { transaction: t });

        pack.priceCents = newPriceCents;

        return pack.save({ transaction: t });
      });

      return newPackage;
    } catch (err: unknown) {
      throw new Error('Error handling the transaction');
    }
  },
	async priceFor(municipality: string) {
    const foundPackage = await Package.findOne({ where: { name: municipality } });

    if (!foundPackage) {
      return null;
    }

		return foundPackage.priceCents;
	},
};
