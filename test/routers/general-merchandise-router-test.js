var should = require('should');
var request = require('supertest');
var uri = `${process.env.IP}:${process.env.PORT}`;

function getData() {
    var GeneralMerchandise = require('dl-models').core.GeneralMerchandise;
    var UoM = require('dl-models').core.UoM;
    var UoM_Template = require('dl-models').core.UoM_Template;

    var generalMerchandise = new GeneralMerchandise();
    var uom_template = new UoM_Template({
        mainValue: 1,
        mainUnit: 'M',
        convertedValue: 1,
        convertedUnit: 'M'
    });

    var _uom_units = [];
    _uom_units.push(uom_template);

    var uom = new UoM({
        category: 'UoM_Unit_Test',
        default: uom_template,
        units: _uom_units
    });

    var now = new Date();
    var stamp = now / 1000 | 0;
    var code = stamp.toString(36);

    generalMerchandise.code = code;
    generalMerchandise.name = `name[${code}]`;
    generalMerchandise.description = `description [${code}]`;
    generalMerchandise.UoM = uom;
    return generalMerchandise;
}

it('#01. Should be able to get list', function (done) {
    request(uri)
        .get('/v1/core/generalmerchandises')
        .expect(200)
        .end(function (err, response) {
            if (err)
                done(err);
            else {
                var result = response.body;
                result.should.have.property("apiVersion");
                result.should.have.property('data');
                result.data.should.instanceOf(Array);
                done();
            }
        });
})

it('#02. should success when create new data', function (done) {
    var data = getData();
    request(uri).post('/v1/core/generalmerchandises')
        .send(data)
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                done();

            }
        });

});

var createdData;

it(`#03. should success when update created data`, function (done) {
    request(uri).put('/v1/core/generalMerchandises')
        .send({ name: 'test_name', code: 'test_code' })
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
});

var createdId;
it("#04. should success when delete data", function (done) {
    request(uri).del('/v1/core/generalMerchandises/:id')
        .query({ _id: createdId })
        .end(function (err, res) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
});
