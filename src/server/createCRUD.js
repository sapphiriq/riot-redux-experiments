import express from 'express';
import Datastore from 'nedb';
import Qs from 'qs';

const DEFAULT_LIMIT = 20;

let done = (db, req, res, name) => {
  return (err, data) => {
    db.count().exec((err, totalCount) => {
      let limit = Number(req.query.limit) || DEFAULT_LIMIT;
      let skip = Number(req.query.skip) || 0;
      let baseUrl = req.protocol + '://' + req.headers.host + req.baseUrl;
      let firstPageUrl = baseUrl + '?limit=' + limit;
      let lastSkip = limit * Math.floor(totalCount / limit);
      if (lastSkip == totalCount) {
        lastSkip -= limit;
      }

      let lastPageUrl = firstPageUrl + '&skip=' + lastSkip;
      let nextPageUrl = null;
      let prevPageUrl = null;

      if (skip + limit >= totalCount) {
        nextPageUrl = null;
      } else {
        nextPageUrl = baseUrl + '?limit=' + limit + '&skip=' + (skip + limit);
      }

      if (limit > totalCount || skip > totalCount || (limit + skip) > totalCount) {
        prevPageUrl = firstPageUrl;
      } else if (skip - limit <= 0) {
        prevPageUrl = null;
      } else {
        prevPageUrl = baseUrl + '?limit=' + limit + ((skip - limit > 0) ? ('&skip=' + (skip - limit)) : '');
      }

      const meta = {
        total: totalCount,
        limit,
        skip,
        firstPageUrl: firstPageUrl,
        nextPageUrl: nextPageUrl,
        prevPageUrl: prevPageUrl,
        lastPageUrl: lastPageUrl,
      };
      res.send({ err, [name]: data, meta });
    });
  };
};

export default function createCRUD(name, pluralName) {
  let filename = __dirname + '/db/' + pluralName + '.db';
  let db = new Datastore({ filename, autoload: true });

  let router = express.Router();

  router.get('/', (req, res, next) => {
    let limit = req.query.limit || DEFAULT_LIMIT;
    let skip = req.query.skip || 0;
    db.find({})
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .exec(done(db, req, res, pluralName));
  });

  router.get('/:id', (req, res, next) => {
    db.findOne({ _id: req.params.id }, done(db, req, res, name));
  });

  router.post('/', (req, res, next) => {
    console.log('req.body', req.body);
    let data = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    db.insert(data, done(db, req, res, name));
  });

  router.put('/:id', (req, res, next) => {
    let query = { _id: req.params.id };
    let data = { ...req.body, updatedAt: new Date() };
    db.update(query, {$set: data}, {}, function(err, numAffected) {
      db.findOne(query, done(db, req, res, name));
    });
  });

  router.delete('/:id', (req, res, next) => {
    db.remove({ _id: req.params.id }, {}, function(err, data) {
      res.send({ err, data });
    });
  });

  return router;
}
