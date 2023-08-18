import {type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model, NonAttribute, Association} from 'sequelize';
import {sequelizeConnection} from '../db/config';
import { Package} from './package';

class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
	declare id: CreationOptional<number>;
	declare priceCents: number;
	declare packageId: ForeignKey<Package['id']>;
	declare municipality: string | null;
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
	municipality: {
		type: DataTypes.STRING,
		allowNull: true
	},
	createdAt: DataTypes.DATE,
	updatedAt: DataTypes.DATE,
}, {
	sequelize: sequelizeConnection,
	modelName: 'Price'
});

export {Price};
