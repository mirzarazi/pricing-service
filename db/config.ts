import {Sequelize} from 'sequelize';

const sequelizeConnection = process.env.NODE_ENV === 'test' ?
	new Sequelize('sqlite::memory:'):
	new Sequelize({
		dialect: 'sqlite',
		storage: './db/sqlite.db',
		logging: false
	});

export {sequelizeConnection};
