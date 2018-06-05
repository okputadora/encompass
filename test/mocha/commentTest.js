const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = fixtures.session;
const baseUrl = "/api/comments/";
const commentId = '';

chai.use(chaiHttp);

/** GET comments**/
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
  it('should fail without user credentials', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', null)
    .end((err, res) => {
      expect(res).to.have.status(401);
      done();
    });
  });
});

/** GET comment by id **/
describe('/GET comment (by id)', () => {
  it('should get one comment with matching id', done => {
    const url = baseUrl + fixtures.comment._id;
    chai.request('http://localhost:8080')
    .get(url)
    .set('Cookie', userCredentials)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.comment).to.have.any.keys('label', 'text', 'submission', 'workspace');
      expect(res.body.comment._id).to.eql(fixtures.comment._id);
      done();
    });
  });
  // it('should fail if id is invalid', done => {
  //   const url = baseUrl + '/badId';
  //   chai.request('http://localhost:8080')
  //   .get(url)
  //   .set('Cookie', userCredentials)
  //   .end((err, res) => {
  //     expect(res).to.have.status(500);
  //     done();
  //   });
  // });
});

/** POST **/
describe('/POST comment', () => {
    it('should post a new comment', done => {
        chai.request('http://localhost:8080')
        .post(baseUrl)
        .set('Cookie', userCredentials)
        .send({comment: fixtures.comment.validComment})
        .end((err, res) => {
            expect(res).to.have.status(200);
            done();
          });
        });
      });

/** PUT name**/
describe('/PUT update comment text', () => {
  it('should change the text field to "this is a test"', done => {
    const url = baseUrl + fixtures.comment._id;
    // copy the comment and update it
    const comment = {comment: Object.assign({}, fixtures.comment.validComment)};
    comment.comment.text = 'this is a test';
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send(comment)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.comment.text).to.eql('this is a test');
      done();
    });
  });
});
