import {type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model} from 'sequelize';
import {sequelizeConnection} from '../db/config';
import {type Package} from './package';
import { Municipality } from './municipality';

class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
	declare id: CreationOptional<number>;
	declare priceCents: number;
	declare packageId: ForeignKey<Package['id']>;
	declare municipalityId: ForeignKey<Municipality['id']>;

	declare createdAt: CreationOptional<Date>;
	declare updatedAt: CreationOptional<Date>;
}

Price.init({
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	priceCents: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
}, {
	sequelize: sequelizeConnection,
});

export {Price};
