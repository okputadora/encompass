// REQUIRE MODULES
const { Builder } = require('selenium-webdriver');
const expect = require('chai').expect;

// REQUIRE FILES
const helpers = require('./helpers');
const dbSetup = require('../data/restore');
const css = require('./selectors');

const host = helpers.host;
const testUsers = require('./fixtures/users');
let topLink = css.topBar.problems;

const handleRetries = function (driver, fetchPromise, numRetries) {
  console.log('inside handleRetries function');
  numRetries = 'undefined' === typeof numRetries ? 1 : numRetries;
  return fetchPromise().catch(function(err) {
    if (numRetries > 0) {
      return handleRetries(driver, fetchPromise, numRetries-1);
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

      describe(`As ${testDescriptionTitle}`, function() {
        this.timeout(helpers.timeoutTestMsStr);
        let driver = null;

        before(async function() {
          driver = new Builder()
            .forBrowser('chrome')
            .build();
            await dbSetup.prepTestDb();
            return helpers.login(driver, host, user);
          });

        after(function() {
          return driver.quit();
        });

        if (!isStudent) {
          describe('Visiting problems main page', function () {
            before(async function () {
              await helpers.findAndClickElement(driver, topLink);
              if (!isStudent) {
                await helpers.waitForSelector(driver, css.problemPageSelectors.problemContainer);
              }
            });

            it('should display side list of filter options', async function () {
              if (!isStudent) {
                expect(await helpers.waitForSelector(driver, css.problemPageSelectors.sideFilterOptions));
              }
              let optionsList = css.problemFilterList.primaryFilters;
              let filterOptions = helpers.createFilterList(isStudent, isAdmin, optionsList, true);
              let filterSelectors = helpers.createSelectors(filterOptions);
              expect(await helpers.checkSelectorsExist(driver, filterSelectors)).to.be.true;
            });

            it('should display category filter options', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, '.category-header');
                let filterSelectors = helpers.createSelectors(css.problemFilterList.categoryFilters);
                expect(await helpers.checkSelectorsExist(driver, filterSelectors)).to.be.true;
                await helpers.findAndClickElement(driver, '.category-header');
              }
            });

            it('should update problem list when clicking on Public', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                let resultsMsg = `${problems.public.count} problems found`;
                await helpers.waitForTextInDom(driver, resultsMsg);
                expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
              }
            });

            it('should update problem list when clicking on Mine', async function () {
              if (!isStudent) {
                await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                let resultsMsg = `${problems.mine.count} problems found`;
                await helpers.waitForTextInDom(driver, resultsMsg);
                expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
              }
            });

            if (!isStudent) {
              xdescribe('Clicking on My Org filter option', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-myOrg label.radio-label');
                  }
                });

                it('should update problem list when clicking on My Org', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.org.total} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should update problem list when unchecking created by members', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.org.recommended} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should update problem list when unchecking recommended', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(css.noResultsMsg);
                  }
                });

                it('should update problem list when checking created by members', async function () {
                  if (!isStudent) {
                    await helpers.waitForAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.org.members} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                    await helpers.waitForAndClickElement(driver, 'li.recommended label.checkbox-label');
                  }
                });
              });

              xdescribe('Clicking on Category filter menu', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '.category-header');
                  }
                });

                it('should show populate categories search list', async function () {
                  if (!isStudent) {
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'CCSS.Math.Content', true);
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await driver.sleep(1000);
                  }
                });

                it('should show problems when adding category with problems to list', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.k} problems found`;
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'CCSS.Math.Content.K');
                    await helpers.findAndClickElement(driver, '[data-value="5bb650e1fefbf3cf9e88f673"]');
                    // await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show more problems when adding category with problems to list', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.total} problems found`;
                    await helpers.clearElement(driver, '#categories-filter-selectized');
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', '8.EE');
                    await helpers.findAndClickElement(driver, '[data-value="5bb650e1fefbf3cf9e88f675"]');
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show less problems when unchecking include subcategories', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.noSub} problems found`;
                    await helpers.findAndClickElement(driver, '.subfilter');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show less problems when removing a category', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.ee} problems found`;
                    await helpers.findAndClickElement(driver, '.subfilter');
                    await driver.sleep(500);
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('there should be no change when adding category with no problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.category.ee} problems found`;
                    await helpers.findInputAndType(driver, '#categories-filter-selectized', 'Math.Content.1', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should clear selected category list', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                  }
                });

                it('should open up category menu modal', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.show-category-btn');
                    await helpers.waitForSelector(driver, '#category-list-modal');
                    await driver.sleep(5000);
                    expect(await helpers.findAndGetText(driver, '.modal-content h4')).to.contain('Select a Category');
                  }
                });

                it('should add category when clicked', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K"]');
                    await driver.sleep(500);
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'label[for="CCSS.Math.Content.K.G.B"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'button[id="CCSS.Math.Content.K.G.B.6"]');
                    await driver.sleep(300);
                    await helpers.findAndClickElement(driver, 'button.close');
                    await driver.sleep(300);
                    let resultsMsg = `1 problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });
              });

              xdescribe('Testing search bar', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, 'ul.selected-cat-list li:first-child i');
                    await helpers.waitForSelector(driver, '.search-bar-comp');
                  }
                });

                it('should have two search options', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="title"]');
                    await helpers.findAndClickElement(driver, 'option[value="general"]');
                  }
                });

                it('should show search results for Public', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.public} problems that contain "problem"`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findInputAndType(driver, '.search-field', 'Problem', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for Org', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.org} problems that contain "problem"`;
                    await helpers.findAndClickElement(driver, 'li.filter-myOrg label.radio-label');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for Mine', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.mine} problems that contain "problem"`;
                    await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                if (isAdmin) {
                  it('should show search results for All', async function () {
                    if (!isStudent) {
                      let resultsMsg = `Based off your filter criteria, we found ${problems.search.all} problems that contain "problem"`;
                      await helpers.findAndClickElement(driver, 'li.filter-all label.radio-label');
                      await helpers.waitForTextInDom(driver, resultsMsg);
                      expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                    }
                  });
                }

                it('should clear search results', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.search.clear} problems found`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show search results for searching by Title', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found ${problems.search.title} problem whose title contains "zebra"`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="title"]');
                    await helpers.findInputAndType(driver, '.search-field', 'Zebra', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show clear button with empty search box and query applied', async function () {
                  if (!isStudent) {
                    await helpers.clearElement(driver, '.search-field');
                    expect(await helpers.isElementVisible(driver, 'svg.clear')).to.be.true;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                  }
                });

                it('should throw and error when search field is empty', async function () {
                  if (!isStudent) {
                    let errorMessage = "Query is too short (minimum is 1 characters)";
                    await helpers.findAndClickElement(driver, '.fa-search');
                    await helpers.waitForSelector(driver, '.error-box');
                    await helpers.waitForTextInDom(driver, errorMessage);
                    expect(await helpers.findAndGetText(driver, '.error-text')).to.contain(errorMessage);
                  }
                });

                it('should throw and error when search is too long', async function () {
                  if (!isStudent) {
                    let errorMessage = "Query is too long (maximum is 500 characters)";
                    await helpers.findInputAndType(driver, '.search-field', css.longString, true);
                    await helpers.findAndClickElement(driver, '.fa-search');
                    await helpers.waitForSelector(driver, '.error-box');
                    await helpers.waitForTextInDom(driver, errorMessage);
                    expect(await helpers.findAndGetText(driver, '.error-text')).to.contain(errorMessage);
                  }
                });

                it('should show results when searching specific word in description', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "graphton"`;
                    await helpers.findAndClickElement(driver, '#my-select select');
                    await helpers.findAndClickElement(driver, 'option[value="general"]');
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'Graphton', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching specific word in additional info', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "expected"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'expected', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by status', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 3 problems that contain "pending"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'pending', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by author', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "mccartney"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'McCartney', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show results when searching by copyright', async function () {
                  if (!isStudent) {
                    let resultsMsg = `Based off your filter criteria, we found 1 problem that contains "apple"`;
                    await helpers.findAndClickElement(driver, 'svg.clear');
                    await helpers.findInputAndType(driver, '.search-field', 'apple', true);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                    await helpers.findAndClickElement(driver, 'svg.clear');
                  }
                });
              });

              xdescribe('Testing layout and refresh', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.refresh-icon');
                  }
                });

                it('should show no changes after refresh', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.public.count} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show card view when clicking on grid', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.grid-icon');
                    await helpers.waitForSelector(driver, '.grid-view');
                    expect(await helpers.isElementVisible(driver, '.grid-view')).to.be.true;
                  }
                });

                it('should show list view when clicking on list view', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.list-icon');
                    await helpers.waitForSelector(driver, '#layout-view');
                    expect(await helpers.isElementVisible(driver, '#layout-view')).to.be.true;
                  }
                });
              });

              xdescribe('Testing sortbar functionality', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.waitForSelector(driver, '.sort-bar');
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                  }
                });

                it('should have sortbar with many options', async function () {
                  if (!isStudent) {
                    let selectors = ['.sort-bar-item.privacy', '.sort-bar-item.name', '.sort-bar-item.date','.sort-bar-item.status'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

                it('should be sorted reverse-alphabetically', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Zebra Problem');
                  }
                });

                it('should be sorted alphabetically', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.name span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Alphabetical Problem');
                  }
                });

                it('should be sorted by most recent', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.date span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Newest Problem');
                  }
                });

                it('should be sorted by oldest', async function () {
                  if (!isStudent) {
                    await helpers.findAndClickElement(driver, '.sort-bar-item.date span');
                    await driver.sleep(500);
                    expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain('Oldest Problem');
                  }
                });

                it('should be filtered by private', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.private} problems found`;
                    await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="M"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should be filtered by public', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.public} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="O,E"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should be filtered by all', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.privacy.total} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.privacy');
                    await helpers.findAndClickElement(driver, '#privacy-menu ul li .radio-filter .radio-label input[value="M,O,E"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out approved problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.pending} problems found`;
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="approved"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out pending problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.flagged} problems found`;
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="pending"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should filter out flagged and only show approved problems', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.approved} problems found`;
                    if (!isTeacher) {
                      await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                      await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="flagged"]');
                    }
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="approved"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

                it('should show all problems no matter the status', async function () {
                  if (!isStudent) {
                    let resultsMsg = `${problems.status.total} problems found`;
                    if (!isTeacher) {
                      await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                      await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="flagged"]');
                    }
                    await helpers.findAndClickElement(driver, '.sort-bar-item.status');
                    await helpers.findAndClickElement(driver, '.hover-menu ul li label input[value="pending"]');
                    await driver.sleep(500);
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  }
                });

              });

              //RESULTS
              //Test that list view displays everything properly
                // privacy, title, description?, status, button, more
                // Recommended problems should have star next to title
              //Test that card view displays everything properly
                // privacy, title, description?, status, button, more
              //Clicking on title/description shows problem info
              //Test action buttons values should be different based off account type and problem status
                //Test all functions of buttons
                //Edit/Assign/Delete/Add from list view
                //Admin - flag, pend, approve
              //Test more menu shows correct values (based off account type and problem status)
                //Test all display options○ Test all functions of buttons

              describe('Testing problem list item functionality', function () {
                before(async function () {
                  if (!isStudent) {
                    await helpers.waitForSelector(driver, '.sort-bar');
                    await helpers.findAndClickElement(driver, 'li.filter-everyone label.radio-label');
                  }
                });

                it('should have sortbar with many options', async function () {
                  if (!isStudent) {
                    let selectors = ['.sort-bar-item.privacy', '.sort-bar-item.name', '.sort-bar-item.date','.sort-bar-item.status'];
                    expect(await helpers.checkSelectorsExist(driver, selectors)).to.be.true;
                  }
                });

              });
            }

            if (isAdmin) {
              xdescribe('Clicking on Trashed problems', function () {
                before(async function () {
                  await helpers.findAndClickElement(driver, '.category-header');
                  await helpers.findAndClickElement(driver, '.more-header');
                });

                it('should update problem list and display message', async function () {
                  await helpers.findAndClickElement(driver, '#toggle-trashed');
                  let resultsMsg = `2 problems found - Displaying Trashed Problems`;
                  await helpers.waitForTextInDom(driver, resultsMsg);
                  expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                });

                it('should restore a trashed problem', async function () {
                  await helpers.findAndClickElement(driver, 'button.primary-button');
                  await driver.sleep(500);
                  await helpers.waitForAndClickElement(driver, 'button.swal2-confirm' );
                  // await helpers.findAndClickElement(driver, 'button.swal2-confirm');
                  let resultsMsg = `1 problems found - Displaying Trashed Problems`;
                  await helpers.waitForTextInDom(driver, resultsMsg);
                  // expect(await helpers.isTextInDom(resultsMsg)).to.be.true;
                  expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                });

                it('should continue displaying trashed problems until unchecked', async function () {
                  await helpers.findAndClickElement(driver, 'li.filter-mine label.radio-label');
                  let resultsMsg = `${problems.mine.count} problems found - Displaying Trashed Problems`;
                  await helpers.waitForTextInDom(driver, resultsMsg);
                  expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);

                  await helpers.findAndClickElement(driver, '.more-filter-list .subfilter input#toggle-trashed');
                  let updatedMsg = `${problems.mine.count} problems found`;

                  await helpers.waitForTextInDom(driver, updatedMsg);
                  expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(updatedMsg);
                  await helpers.findAndClickElement(driver, '.more-header');
                });
              });

              xdescribe('Clicking on All problems filter', function () {
                before(async function () {
                  await helpers.findAndClickElement(driver, 'li.filter-all label.radio-label');
                });

                it('should update the problem list and display message', async function () {
                  await helpers.waitForSelector(driver, css.resultsMesasage);
                  let resultsMsg = `${problems.all.total} problems found`;
                  await helpers.waitForTextInDom(driver, resultsMsg);
                  expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                });

                it('should test pagination and go to the second page', async function () {
                  await helpers.findAndClickElement(driver, '.sort-bar-item.name');
                  await helpers.findAndClickElement(driver, '.nav-right i.fa-caret-right');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain(`Alphabetical Problem`);
                });

                it('should test pagination and go back to the first page', async function () {
                  await helpers.findAndClickElement(driver, '.nav-left i.fa-caret-left');
                  await driver.sleep(500);
                  expect(await helpers.findAndGetText(driver, '#problem-list-ul li:first-child .item-section.name span:first-child')).to.contain(`Oldest Problem`);
                });

                describe('Searching by organization', function () {
                  before(async function () {
                    await helpers.findInputAndType(driver, '#all-org-filter-selectized', 'Mathematical Thinking', true);
                    await helpers.findAndClickElement(driver, css.resultsMesasage);
                  });

                  it('should select an organization then update the list and display message', async function () {
                    let resultsMsg = `${problems.all.org.total} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });

                  it('should uncheck Created by Members then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.all.org.recommended} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg );
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });

                  it('should uncheck Recommended then no problems should appear', async function () {
                    await helpers.findAndClickElement(driver, 'li.recommended label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(css.noResultsMsg);
                  });

                  it('should check Created by Members and the update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.fromOrg label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.all.org.members} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });
                });

                describe('Searching by creator', function () {
                  before(async function () {
                    await helpers.findAndClickElement(driver, '#admin-filter-select-selectized');
                    await helpers.findAndClickElement(driver, '[data-value="creator"]');
                    await helpers.findInputAndType(driver, '#all-user-filter-selectized', 'morty');
                    await helpers.waitForSelector(driver, '[data-value="5b245841ac75842be3189526"]');
                    await helpers.findAndClickElement(driver, '[data-value="5b245841ac75842be3189526"]');
                    await helpers.findAndClickElement(driver, css.resultsMesasage);
                  });

                  it('should select a creator and then update the list and display message', async function () {
                    let resultsMsg = `${problems.all.creator} problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });
                });

                describe('Searching by PoWs', function () {
                  before(async function () {
                    await helpers.findAndClickElement(driver, '.selectize-input');
                    await helpers.findAndClickElement(driver, '#admin-filter-select-selectized');
                    await helpers.findAndClickElement(driver, '[data-value="pows"]');
                  });

                  it('should update the list and display message', async function () {
                    let resultsMsg = `${problems.all.pows.total} problems found`;
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });

                  it('should uncheck public then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.shared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.all.pows.private} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });

                  it('should uncheck private then show no problems', async function () {
                    await helpers.findAndClickElement(driver, 'li.unshared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    await helpers.waitForTextInDom(driver, css.noResultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(css.noResultsMsg);
                  });

                  it('should check private then update the list and display message', async function () {
                    await helpers.findAndClickElement(driver, 'li.shared label.checkbox-label');
                    await helpers.waitForSelector(driver, css.resultsMesasage);
                    let resultsMsg = `${problems.all.pows.public} problems found`;
                    await helpers.waitForTextInDom(driver, resultsMsg);
                    expect(await helpers.findAndGetText(driver, css.resultsMesasage)).to.contain(resultsMsg);
                  });
                });

              });
            }

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



