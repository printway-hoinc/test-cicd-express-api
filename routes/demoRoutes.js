import express from 'express';

const Router = express.Router();

Router.route('/hello-world').get((req, res) => {
  return res.status(200).json({
    message: 'Hello world'
  })
});

export default Router;