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
  });

  it("should be able to find user's friends' name", () => {
    expect(user.findFriendsInfo(userRepo.data, 'name')).to.eql([ 'Jarvis Considine', 'Herminia Witting' ])
  });

  it("should be able to find user's friends' daily step goal", () => {
    expect(user.findFriendsInfo(userRepo.data, 'dailyStepGoal')).to.eql([ 5000, 5000 ])
  });

  it("should be able to collect a user's friends' step data for a week", () => {
    expect(user.rateFriends(userRepo.data, activityRepo)).to.eql([
      { name: 'Luisa', steps: 58629 },
      { name: 'Jarvis', steps: 55054 },
      { name: 'Herminia', steps: 50627} ])
  });
});
