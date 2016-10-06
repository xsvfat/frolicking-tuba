const Key = require('../server/models/key');
const Integration = require('../server/models/integration');
const Output = require('../server/models/output');
const server = require('../server/server');
const request = require('supertest');
const config = require('../env/config.json');
const http = require('http');

describe('annotation', () => { // eslint-disable-line max-statements
  let apiKeyGithub = '';
  let apiKeyURL = '';

  before((done) => {
    Output.sync({ force: true })
      .then(() => Key.sync({ force: true }))
      .then(() => Integration.sync({ force: true }))
      .then(() => done());
  });

  const mockServerPort = 1338;
  const mockServerUrl = `http://localhost:${mockServerPort}`;
  const githubMockPath = '/github/repos/user/repo/issues';
  const urlMockPath = '/url';

  // run mock server
  before((done) => {
    const issues = [];
    const urlPosts = [];

    config.github.api_url = `${mockServerUrl}/github`;

    http.createServer((req, res) => { // eslint-disable-line max-statements
      console.log(`${req.method} to ${req.url}`);
      if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (req.url === githubMockPath) {
          res.end(JSON.stringify(issues));
        } else if (req.url === urlMockPath) {
          res.end(JSON.stringify(urlPosts));
        }
      } else if (req.method === 'POST') {
        let body = '';

        req.on('data', (data) => {
          body += data;
        });

        req.on('end', () => {
          body = JSON.parse(body);
          if (req.url === githubMockPath) {
            issues.push(body);
          } else if (req.url === urlMockPath) {
            urlPosts.push(body);
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ issues: 'created' }));
        });
      }
    })
    .listen(mockServerPort, done);
  });

  //ooh, a pyramid
  before((done) => {
    // create Github test key
    Key.create().then((key) => {
      Integration.create({
        meta: 'GITHUBKEYHERE',
        type: 'github'
      }).then((integration) => {
        apiKeyGithub = key.key;
        Output.create({
          keyId: key.id,
          integrationId: integration.id,
          meta: 'user/repo'
        }).then(() => done());
      });
    });
  });

  before((done) => {
    // create URL test key
    Key.create().then((key) => {
      Integration.create({
        meta: 'URLKEYHERE',
        type: 'url'
      }).then((integration) => {
        apiKeyURL = key.key;
        Output.create({
          keyId: key.id,
          integrationId: integration.id,
          meta: `${mockServerUrl}/url`
        }).then(() => done());
      });
    });
  });

  it('should not POST to /annotate without key', (done) => {
    request(server)
      .post('/api/annotate')
      .expect(400)
      .end(done);
  });

  it('should POST to /annotate with Github key', (done) => {
    request(server)
      .post('/api/annotate')
      .send({
        key: apiKeyGithub,
        title: 'a test annotation',
        to: 'to user',
        from: 'from user',
        selected: 'this would be the selected text',
        comment: 'this is the comment'
      })
      .expect(200)
      .end(done);
  });

  it('should create github issue when POST to /annotate', (done) => {
    request(mockServerUrl)
      .get(githubMockPath)
      .expect(200)
      .end((err, res) => {
        res.body[0].title.should.eql('a test annotation');
        done(err);
      });
  });

  it('should POST to /annotate with URL key', (done) => {
    console.log('apiKeyGithub:', apiKeyGithub);
    console.log('apiKeyURL:', apiKeyURL);
    request(server)
      .post('/api/annotate')
      .send({
        key: apiKeyURL,
        title: 'a test annotation',
        to: 'to user',
        from: 'from user',
        selected: 'this would be the selected text',
        comment: 'this is the comment'
      })
      .expect(200)
      .end(done);
  });

  xit('should should be able to POST to mock server /url', (done) => {
    request(mockServerUrl)
      .post('/url')
      .send({
        title: 'a test annotation',
        to: 'to user',
        from: 'from user',
        selected: 'this would be the selected text',
        comment: 'this is the comment'
      })
      .expect(200)
      .end(done);
  });

  it('should make POST request to a URL when POST to /annotate', (done) => {
    request(mockServerUrl)
      .get('/url')
      .expect(200)
      .end((err, res) => {
        res.body[0].title.should.eql('a test annotation');
        done(err);
      });
  });
});
