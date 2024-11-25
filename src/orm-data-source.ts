import { DataSource } from 'typeorm';
import ormconfig from './orm-config';
export default new DataSource(ormconfig);
