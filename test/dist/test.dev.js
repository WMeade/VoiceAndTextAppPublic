"use strict";

var request = require('supertest');

var app = require('../app.js');

describe('GET /', function () {
  it('respond with login/main app', function (done) {
    request(app).get('/').expect(200).end(function (err, res) {
      done();
    });
  });
});