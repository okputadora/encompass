const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = fixtures.session;
const baseUrl = "/api/answers/";
const answerId = '';

chai.use(chaiHttp);

/** GET **/
describe('/GET answers', () => {
  it('should get all answers', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials) // what to do about this?
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('answers');
      expect(res.body.answers).to.be.a('array');
      expect(res.body.answers.length).to.be.above(0);
      done();
    });
  });
});

/** POST **/
describe('/POST answer', () => {
  it('should post a new answer', done => {
    chai.request('http://localhost:8080')
    .post(baseUrl)
    .set('Cookie', userCredentials)
    .send({answer: fixtures.answer.validAnswer})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.answer).to.have.any.keys('puzzleId', 'categories', 'title');
      expect(res.body.answer.title).to.eql('test math answer');
      done();
    });
  });
});

/** PUT name**/
describe('/PUT update answer name', () => {
  it('should change the title to test science answer', done => {
    let url = baseUrl + answerId;
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({answer: {title: 'test science answer'}})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.answer).to.have.any.keys('puzzleId', 'title', 'categories');
      expect(res.body.answer.title).to.eql('test science answer');
      done();
    });
  });
});
