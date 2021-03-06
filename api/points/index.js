const express = require('express');
const fs = require('fs');
const router = express.Router();

var sqlQuery = fs.readFileSync('queries/points.sql').toString();


router.get('/', function(req, res, next) {
  console.log('Accessing /api/points');
  console.log(sqlQuery);

  const pool = req.app.get('pool');
  const distance = (req.query.distance) ? req.query.distance:999999
  const limit = (req.query.limit) ? req.query.limit:9999

  pool.connect((err, client, done) => {
    if (err) throw err;
    console.log(req.query);
    if (Object.keys(req.query).length == 0) {
      res.json({
				message: 'Accessing /api/points route',
				status: 'OK'
			});
			next();
    }
    else {
      client.query(sqlQuery, [req.query.lng, req.query.lat,
        req.query.amenity[0], req.query.amenity[1], req.query.amenity[2],
        distance, limit], (err, result) => {
        done();

        console.log('lng        ' + req.query.lng);
        console.log('lat        ' + req.query.lat);
        console.log('amenities  ' + req.query.amenity);
        console.log('distance   ' + distance);
        console.log('limit      ' + limit);
        console.log('Returned   ' + result.rowCount + ' rows');

        var i;
        var r = [];
        for (i in result.rows) {
          r.push(result.rows[i].geojson);
        }

        res.json(r);
      });
    }
  });
});


module.exports = router;
