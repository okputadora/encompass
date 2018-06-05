const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = fixtures.session;
const baseUrl = "/api/comments/";
const commentId = '';

chai.use(chaiHttp);

/** GET **/
describe('/GET comments', () => {
  it('should get all comments', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials) // what to do about this?
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('comment', 'selection', 'submission', 'user', 'workspace');
      expect(res.body.comment).to.be.a('array');
      done();
    });
  });
});

// /** POST **/
// describe('/POST comment', () => {
//   it('should post a new comment', done => {
//     chai.request('http://localhost:8080')
//     .post(baseUrl)
//     .set('Cookie', userCredentials)
//     .send({comment: fixtures.comment.validAnswer})
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//       expect(res.body.comment).to.have.any.keys('puzzleId', 'categories', 'title');
//       expect(res.body.comment.title).to.eql('test math comment');
//       done();
//     });
//   });
// });
//
// /** PUT name**/
// describe('/PUT update comment name', () => {
//   it('should change the title to test science comment', done => {
//     let url = baseUrl + commentId;
//     chai.request('http://localhost:8080')
//     .put(url)
//     .set('Cookie', userCredentials)
//     .send({comment: {title: 'test science comment'}})
//     .end((err, res) => {
//       expect(res).to.have.status(200);
//       expect(res.body.comment).to.have.any.keys('puzzleId', 'title', 'categories');
//       expect(res.body.comment.title).to.eql('test science comment');
//       done();
//     });
//   });
// });
