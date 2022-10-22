import { Container } from 'inversify';
import 'reflect-metadata';
import { GridService } from './service/GridService';

const container: Container = new Container();

// service
container.bind<GridService>(GridService).toSelf();

export { container as bindings };
