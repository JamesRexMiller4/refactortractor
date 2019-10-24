const chai = require('chai');
const expect = chai.expect;

import User from '../src/User';
import Repository from '../src/Repository';
import Activity from '../src/Activity-Repository';
import userTestData from '../test-data/user-test-data';
import hydroTestData from '../test-data/hydration-test-data';
import sleepTestData from '../test-data/sleep-test-data';
import activityTestData from '../test-data/activity-test-data';

describe('User', function() {
  let user; let userRepo; let activityRepo;
  beforeEach(() => {
    userRepo = new Repository(userTestData);
    user = new User(userRepo.findUser(1));
    activityRepo = new Activity(activityTestData);
  });

  it('should return the first name', function() {
    expect(user.returnUserFirstName()).to.equal('Luisa');
  });

  it('should be able to find the current user data amongst all datasets', function() {
    expect(user.findCurrentUserData(hydroTestData)).to.eql([
      { userID: 1, date: '2019/06/15', numOunces: 37 },
      { userID: 1, date: '2019/06/16', numOunces: 69 },
      { userID: 1, date: '2019/06/17', numOunces: 96 },
      { userID: 1, date: '2019/06/18', numOunces: 61 },
      { userID: 1, date: '2019/06/19', numOunces: 91 },
      { userID: 1, date: '2019/06/20', numOunces: 50 },
      { userID: 1, date: '2019/06/21', numOunces: 50 },
      { userID: 1, date: '2019/06/22', numOunces: 43 },
      { userID: 1, date: '2019/06/23', numOunces: 39 }
    ]);
    expect(user.findCurrentUserData(sleepTestData)).to.eql([
      { userID: 1, date: '2019/06/15', hoursSlept: 6.1, sleepQuality: 2.2 },
      { userID: 1, date: '2019/06/16', hoursSlept: 4.1, sleepQuality: 3.8 },
      { userID: 1, date: '2019/06/17', hoursSlept: 8, sleepQuality: 2.6 },
      { userID: 1, date: '2019/06/18', hoursSlept: 10.4, sleepQuality: 3.1 },
      { userID: 1, date: '2019/06/19', hoursSlept: 10.7, sleepQuality: 1.2 },
      { userID: 1, date: '2019/06/20', hoursSlept: 9.3, sleepQuality: 1.2 },
      { userID: 1, date: '2019/06/21', hoursSlept: 7.8, sleepQuality: 4.2 },
      { userID: 1, date: '2019/06/22', hoursSlept: 10, sleepQuality: 3 }
    ]);
    expect(user.findCurrentUserData(activityTestData)).to.eql([
      { userID: 1, date: '2019/06/15', numSteps: 3577, minutesActive: 140, flightsOfStairs: 16 },
      { userID: 1, date: '2019/06/16', numSteps: 6637, minutesActive: 175, flightsOfStairs: 36 },
      { userID: 1, date: '2019/06/17', numSteps: 14329, minutesActive: 168, flightsOfStairs: 18 },
      { userID: 1, date: '2019/06/18', numSteps: 4419, minutesActive: 165, flightsOfStairs: 33 },
      { userID: 1, date: '2019/06/19', numSteps: 8429, minutesActive: 275, flightsOfStairs: 2 },
      { userID: 1, date: '2019/06/20', numSteps: 14478, minutesActive: 140, flightsOfStairs: 12 },
      { userID: 1, date: '2019/06/21', numSteps: 6760, minutesActive: 135, flightsOfStairs: 6 }
    ]);
  });

  it("should be able to collect a user's friends' step data for a week", () => {
    expect(user.rateFriends(userRepo, activityRepo)).to.eql([ { name: 'Luisa Hane', steps: 58629 } ])
  });
});