import express from 'express';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.config';

import api from './api';
import appPrerenderer from './appPrerenderer';
import indexPageTemplate from './indexPageTemplate';

const PORT = process.env.PORT || 3000;
const PRERENDER = (process.env.PRERENDER == 'false') ? false : true;

export default function () {
  let app = express();

  var compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));

  // API
  // ------------------------------------------
  app.use('/favicon.ico', (req, res, next) => {
    res.sendStatus(404);
  });
  app.use('/api', bodyParser.json());
  app.use('/api', api);

  // App renderer
  // ------------------------------------------
  if (PRERENDER) {
    app.use(appPrerenderer);
  } else {
    app.use((req, res, next) => {
      res.send(indexPageTemplate({ html: '<app><h1>Render from server</h1></app>', initialState: undefined }));
    });
  }

  // Init
  // ------------------------------------------
  app.listen(PORT, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', PORT, PORT);
    }
  });

}
