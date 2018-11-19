// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');
const topLink = css.topBar.problems;

const handleRetries = function (driver, fetchPromise, numRetries) {
  console.log('inside handleRetries function');
  numRetries = 'undefined' === typeof numRetries ? 1 : numRetries;
  return fetchPromise().catch(function (err) {
    if (numRetries > 0) {
      return handleRetries(driver, fetchPromise, numRetries - 1);
    }
    throw err;
  });
};

describe('Problems', async function () {
  function runTests(users) {
    function _runTests(user) {
      const { accountType, actingRole, testDescriptionTitle, problems } = user;
      const isStudent = accountType === 'S' || actingRole === 'student';
      const isAdmin = accountType === 'A';
      const isTeacher = accountType === 'T';
      const isPdadmin = accountType === 'P';

      describe(`As ${testDescriptionTitle}`, function () {
        this.timeout(helpers.timeoutTestMsStr);
        let driver = null;

        before(async function () {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
          driver.manage().window().setRect({
            width: 1580,
            height: 1080
          });
          await dbSetup.prepTestDb();
          return helpers.login(driver, host, user);
        });

        after(function () {
          return driver.quit();
        });

        if (!isStudent) {
          describe('Visiting problems new & info pages', function () {
            before(async function () {
              await helpers.findAndClickElement(driver, topLink);
              if (!isStudent) {
                await helpers.waitForSelector(driver, css.problemPageSelectors.problemContainer);
              }
            });
            describe('Clicking on problem new page', function () {
              before(async function () {
                if (!isStudent) {
                  await helpers.findAndClickElement(driver, topLink);
                  await helpers.findAndClickElement(driver, css.topBar.problemsNew);
                }
              });

              it('should open problem new page from topbar', async function () {
                if (!isStudent) {
                  await helpers.waitForSelector('#problem-new');
                  expect(await helpers.findAndGetText(driver, '#problem-new .side-info-menu .info-details .info-main .heading')).to.contain('Create New Problem');
                }
              });

              // it('should open problem new page from plus icon', async function () {
              //   if (!isStudent) {
              //     await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
              //     await helpers.waitForSelector(driver, css.resultsMesasage);
              //     let resultsMsg = `${problems.org.recommended} problems found`;
              //     await helpers.waitForTextInDom(driver, resultsMsg);
              //     expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
              //   }
              // });

              // it('should show recommended problems with stars', async function () {
              //   if (!isStudent) {
              //     expect(await helpers.isElementVisible(driver, '#problem-list-ul li:first-child .item-section.name span:nth-child(2)')).to.be.true;
              //   }
              // });


              // it('should update problem list when unchecking recommended', async function () {
              //   if (!isStudent) {
              //     await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
              //     await helpers.waitForSelector(driver, css.resultsMesasage);
              //     await helpers.waitForTextInDom(driver, css.noResultsMsg);
              //     expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(css.noResultsMsg);
              //   }
              // });

              // it('should update problem list when checking created by members', async function () {
              //   if (!isStudent) {
              //     await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
              //     await helpers.waitForSelector(driver, css.resultsMesasage);
              //     let resultsMsg = `${problems.org.members} problems found`;
              //     await helpers.waitForTextInDom(driver, resultsMsg);
              //     expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
              //     await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
              //   }
              // });
            });


          });
        }

      });
    }
    // for (let user of Object.keys(users)) {
    //   // eslint-disable-next-line no-await-in-loop
    //   await _runTests(users[user]);
    // }
    return Promise.all(Object.keys(users).map(user => _runTests(users[user])));
  }
  await runTests(testUsers);
});
