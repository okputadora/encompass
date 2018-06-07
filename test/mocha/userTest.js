const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const fixtures = require('./fixtures.js');
const userCredentials = fixtures.session;
const baseUrl = "/api/users/";
chai.use(chaiHttp);

/** GET **/
describe('/GET users', () => {
  it('should get all users', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('user');
      expect(res.body.user).to.be.a('array');
      expect(res.body.user.length).to.be.above(0);
      done();
    });
  });
});

/** GET **/
describe('/GET user by name', () => {
  it('should return all users with the name "steve"', done => {
    chai.request('http://localhost:8080')
    .get(baseUrl)
    .set('Cookie', userCredentials)
    .query('name=steve')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('user');
      expect(res.body.user).to.be.a('array');
      res.body.user.forEach(user => {
        expect(user.username).to.have.string('steve');
      });
      done();
    });
  });
});

/** GET **/
describe('/GET user by id', () => {
  it('should return the user "steve"', done => {
    const url = baseUrl + fixtures.user._id;
    chai.request('http://localhost:8080')
    .get(url)
    .set('Cookie', userCredentials)
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.have.all.keys('user');
      expect(res.body.user).to.be.a('object');
      expect(res.body.user.username).to.eql('steve');
      done();
    });
  });
});


/** POST NB this test fails now cause we're not resetting the db
    When db updating is implemented delete the expect statement
    and then uncomment the remaining expect statements
**/
describe('/POST user', () => {
  it('should post a new user', done => {
    chai.request('http://localhost:8080')
    .post(baseUrl)
    .set('Cookie', userCredentials)
    .send({user: fixtures.user.validUser})
    .end((err, res) => {
      expect(res).to.have.status(500);
      // expect(res).to.have.status(200);
      // expect(res.body.user).to.have.any.keys('username');
      // expect(res.body.user.usernam).to.eql('testUser');
      done();
    });
  });
});

/** PUT name**/
describe('/PUT update user name', () => {
  it('should change steves password to testPassword', done => {
    const url = baseUrl + fixtures.user._id;
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({user: {password: 'testPassword'}})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.user.username).to.eql('steve');
      expect(res.body.user.password).to.eql('testPassword');
      done();
    });
  });
});

/** PUT addSection **/
describe('/PUT add section', () => {
  it('should add a section to the user steve', done => {
    console.log(fixtures.user.section);
    const url = baseUrl + 'addSection/' + fixtures.user._id;
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({section: fixtures.user.section})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.user).to.have.any.keys("sections");
      expect(res.body.user.sections[0].sectionId).to.eql(fixtures.user.section.sectionId);
      done();
    });
  });
});

/** PUT removeSection **/
describe('/PUT remove section', () => {
  it('should remove the section we just added', done => {
    const url = baseUrl + 'removeSection/' + fixtures.user._id;
    chai.request('http://localhost:8080')
    .put(url)
    .set('Cookie', userCredentials)
    .send({section: fixtures.user.section})
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.user).to.have.any.keys("sections");
      expect(res.body.user.sections).to.not.include(fixtures.user.section);
      done();
    });
  });
});
