const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = fixtures.session;
const baseUrl = "/api/workspaces/";
chai.use(chaiHttp);

/** GET workspaces**/
describe('/GET workspaces', () => {
  it('should get all workspaces', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.any.keys('workspaces');
      // expect(res.body.workspace).to.be.a('array');
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

/** GET workspace by id **/
describe('/GET workspace (by id)', () => {
  it('should get one workspace with matching id', done => {
    const url = baseUrl + fixtures.workspace._id;
    chai.request('http://localhost:8080')
    .get(url)
    .set('Cookie', userCredentials)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.workspace).to.have.any.keys('submissionSet', 'editors');
      expect(res.body.workspace._id).to.eql(fixtures.workspace._id);
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


// Posting a new workspace is a huge task that invokes many other
// resources -- I'm going to skip it for now as this doesn't quite
// seem like a "unit" test

// /** POST **/
// describe('/POST workspace', () => {
//   it('should post a new workspace', done => {
//     const postUrl = '/api/newWorkspaceRequest';
//     chai.request('http://localhost:8080')
//     .post(baseUrl)
//     .set('Cookie', userCredentials)
//     .send({workspace: fixtures.workspace.validWorkspace})
//     .end((err, res) => {
//         expect(res).to.have.status(200);
//         console.log(res.body.workspace);
//         done();
//     });
//   });
// });

/** PUT name**/
describe('/PUT update workspace text', () => {
  it('should change the text field to "this is a test"', done => {
    const url = baseUrl + fixtures.workspace._id;
    // copy the workspace and update it
    const workspace = {workspace: Object.assign({}, fixtures.workspace.validWorkspace)};
    workspace.workspace.text = 'this is a test';
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send(workspace)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.workspace.text).to.eql('this is a test');
      done();
    });
  });
});
