let chai = require("chai");
let chaiHttp = require("chai-http");
var should = chai.should();
chai.use(chaiHttp);

let app = require("./../app");
let token;

describe("User APIs", () => {
  beforeEach((done) => {
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
//   afterEach((done) => {
//     // After each test do some operation
//   });

  describe("GET /user/profile/:id", () => {
    it("It Should return user profile data", (done) => {
      const userId = "624540ca4ac88651a691f99e";
      chai
        .request(app)
        .get("/user/profile/" + userId)
        .set({ Authorization: `Bearer ${token}` })
        .set("Accept", "application/json")
        .set("Content-Type", "application/json")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          done();
        });
    });
  });
});

