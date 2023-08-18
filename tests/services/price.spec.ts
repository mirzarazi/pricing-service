import {sequelizeConnection} from '../../db/config';
import {Package} from '../../models/package';
import { Price } from '../../models/price';
import PackageService from '../../services/package.service';
import PriceService from '../../services/price.service';

describe('PriceService', () => {
	// Set the db object to a variable which can be accessed throughout the whole test file
	const db = sequelizeConnection;

	// Before any tests run, clear the DB and run migrations with Sequelize sync()
	beforeEach(async () => {
		await Package.sync({force: true});
    await Price.sync({force: true});
	});

	afterAll(async () => {
		await db.close();
	});

  it('Returns the pricing history for the provided year and package', async () => {
    const basic = await Package.create({ name: 'basic', priceCents: 20_00 });

    const date = new Date();

    date.setFullYear(2020);
    const update1 = await PackageService.updatePackagePrice(basic, 30_00, 'Göteborg', date);
    const update2 = await PackageService.updatePackagePrice(update1, 40_00, 'Stockholm', date);
    await PackageService.updatePackagePrice(update2, 100_00, 'Stockholm', date);
    const history = await PriceService.getPriceHistory()
    expect(history).toEqual({
      Göteborg: [3000],
      Stockholm: [4000],
    });
  });

  it('Supports filtering on municipality', async () => {
    const basic = await Package.create({ name: 'basic', priceCents: 20_00 });

    const date = new Date();

    date.setFullYear(2020);
    const update1 = await PackageService.updatePackagePrice(basic, 20_00, 'Göteborg', date);
    const update2 = await PackageService.updatePackagePrice(update1, 30_00, 'Stockholm', date);
    await PackageService.updatePackagePrice(update2, 100_00, 'Stockholm', date);
    const history = await PriceService.getPriceHistoryByMunicipality('Göteborg');
    expect(history[0]).toBe(20_00);
  })
});
