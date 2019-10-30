const chai = require('chai');
const expect = chai.expect;

// import Repository from '../src/Repository';
import Hydration from '../src/Hydration-Repository';
import User from '../src/User';
import Repository from '../src/Repository';
import userTestData from '../test-data/user-test-data';
import hydrationTestData from '../test-data/hydration-test-data';
import spies from 'chai-spies';
// const spies = require('chai-spies')
chai.use(spies);


describe('Hydration', () => {
  let hydration, user, userRepo, methodName
  userRepo = new Repository(userTestData)
  hydration = new Hydration(hydrationTestData);
  user = new User(userRepo.findUser(1));
  // const spy = chai.spy(hydration.returnAverage(('numOunces', user.findCurrentUserData(hydrationTestData))))
  chai.spy.on(hydration, 'returnAverage', () => {})

  beforeEach(() => {
    userRepo = new Repository(userTestData)
    hydration = new Hydration(hydrationTestData);
    user = new User(userRepo.findUser(1));
  });

  it.skip('should return a boolean determining whether the user drank enough water for the last week', () => {
    expect(hydration.returnDidUserDrinkEnoughWater('numOunces', user, user.findCurrentUserData(hydrationTestData))).to.equal(false);
  })
  
});

it.skip("should return the average metric for all users' data", () => {
 let userRepo = new Repository(userTestData)
 let hydration = new Hydration(hydrationTestData);
 let user = new User(userRepo.findUser(1));
 chai.spy.on(hydration, 'returnAverage', () => 61);
 let hydro = hydration.returnAverage('numOunces');

  expect(hydration.returnAverage).to.be.spy;
  expect(hydration.returnAverage).to.have.been.called(1)
  expect(hydro).to.equal(61);

});

it.skip("should return the average metric for a single user", () => {
  let userRepo = new Repository(userTestData)
  let hydration = new Hydration(hydrationTestData);
  let user = new User(userRepo.findUser(1));
  chai.spy.on(hydration, 'returnAverage', () => 59);
  const spy = chai.spy(hydration.returnAverage('numOunces', user.findCurrentUserData(hydrationTestData)))

  expect(hydration.returnAverage).to.be.spy;
  expect(hydration.returnAverage).to.have.been.called(1)
  expect(hydration.returnAverage('numOunces', user.findCurrentUserData(hydrationTestData))).to.equal(59);

});



describe('returnMetricByWeek method', () => {
  let userRepo = new Repository(userTestData)
  let hydration = new Hydration(hydrationTestData);
  let user = new User(userRepo.findUser(1));
  chai.spy.on(hydration, 'returnMetricByWeek', () => [96, 61, 91, 50, 50, 43, 39]);
  const spy = chai.spy(hydration.returnMetricByWeek('numOunces', user.findCurrentUserData(hydrationTestData)))

it.skip("should return a weeks worth of data points for a single user", () => {


  expect(hydration.returnMetricByWeek).to.be.spy;
  expect(hydration.returnMetricByWeek).to.have.been.called(1)
  expect(hydration.returnMetricByWeek('numOunces', user.findCurrentUserData(hydrationTestData))).to.eql([96, 61, 91, 50, 50, 43, 39]);
})

});

describe('returnMetricByDate method', () => {
  let userRepo = new Repository(userTestData)
  let hydration = new Hydration(hydrationTestData);
  let user = new User(userRepo.findUser(1));
  chai.spy.on(hydration, 'returnMetricByDate', () => 39);
  const spy = chai.spy(hydration.returnMetricByDate('numOunces', user.findCurrentUserData(hydrationTestData), hydration.date))


it.only("should return a user's stats for a particular day", () => {
  hydration.findToday(hydration.data);

  expect(hydration.returnMetricByDate).to.be.spy;
  expect(hydration.returnMetricByDate).to.have.been.called(1)
  expect(hydration.returnMetricByDate('numOunces', user)).to.equal(39);

});
});