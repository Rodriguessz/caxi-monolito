import { DataSource } from 'typeorm';
import { dataSourceOptions } from './config';

export default new DataSource(dataSourceOptions);
