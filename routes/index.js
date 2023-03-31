import demoRoutes from './demoRoutes.js';

const routes = app => {
  app.use('/api/v1', demoRoutes)
}

export default routes;