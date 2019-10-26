const chai = require('chai');
const expect = chai.expect;

import Repository from '../src/Repository';
import Activity from '../src/Activity-Repository';
import User from '../src/User';
import activityTestData from '../test-data/activity-test-data';
import userTestData from '../test-data/user-test-data.js';

describe('Activity', () => {
  let activity, user, userRepo;

  beforeEach(() => {
    userRepo = new Repository(userTestData);
    user = new User(userRepo.findUser(1));
    activity = new Activity(activityTestData);
    activity.findToday(activity.data)
  });

 
  it('should return a boolean based on whether a user achieved their step goal an a specific day', () => {
    expect(activity.checkStepGoalMetByDate(activity.data, user)).to.equal(false);
  });

  it('should calculate a user\'s miles walked on a given day', function () {
    expect(activity.returnMilesWalkedByDate(user)).to.equal(6);
  });

  it('should be able to find streaks of three days where steps increased for each day', () => {
    expect(activity.returnThreeDayStepStreak(user)).to.eql([{
      "2019/06/15": 3577,
      "2019/06/16": 6637,
      "2019/06/17": 14329
    },
    {
      "2019/06/18": 4419,
      "2019/06/19": 8429,
      "2019/06/20": 14478
    }
    ]);
  });

  it('should return the number of times the user has climbed the equivelant of Republic Plaza', () => {
    expect(activity.republicPlazaChallenge(activity.data, user)).to.equal(2);
  });

});