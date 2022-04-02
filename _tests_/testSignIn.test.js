let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);

let app = require("./../app");
let token;

describe("POST /auth/signin", () => {
  it("Should success if credential is valid", (done) => {
    chai
      .request(app)
      .post("/auth/signin")
      .send({ email: "ravisharmacs09@gmail.com", password: "ravics09" })
      .end((err, res) => {
        token = res.body.accessToken;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("accessToken");
        res.body.should.have.property("user");
        done();
      });
  });
});
