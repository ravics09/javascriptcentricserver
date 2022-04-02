let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);
let app = require("./../app");

describe("GET /message", () => {
  it("It should get a message", (done) => {
    chai
      .request(app)
      .get("/message")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});


