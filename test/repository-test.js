const chai = require('chai');
const expect = chai.expect;

import Repository from '../src/Repository';
import Sleep from '../src/Sleep-Repository';
import Hydration from '../src/Hydration-Repository'
import Activity from '../src/Activity-Repository';
import userTestData from '../test-data/user-test-data';
import sleepTestData from '../test-data/sleep-test-data';
import hydroTestData from '../test-data/hydration-test-data';
import activityTestData from '../test-data/activity-test-data';
import User from '../src/User';

describe('Repository', () => {
  let userRepo, user, sleepRepo, hydroRepo, activityRepo;
  beforeEach(() => {
    userRepo = new Repository(userTestData);
    user = new User(userRepo.findUser(1));
    sleepRepo = new Sleep(sleepTestData);
    hydroRepo = new Hydration(hydroTestData);
    activityRepo = new Activity(activityTestData);
  });

  it('should be able to locate a user from the dataset', () => {
  
    expect(userRepo.findUser(1)).to.deep.equal({
      "id": 1,
      "name": "Luisa Hane",
      "address": "15195 Nakia Tunnel, Erdmanport VA 19901-1697",
      "email": "Diana.Hayes1@hotmail.com",
      "strideLength": 4.3,
      "dailyStepGoal": 10000,
      "friends": [
        16,
        4,
        8
      ]
    });
  });

  it("should return the average for all users' data", () => {
    expect(sleepRepo.returnAverage('hoursSlept')).to.equal(8.5);
  });

  it.skip("should return the average step count of all users", () => {
    expect(userRepo.returnAllUsersAverageStepGoal()).to.equal(6666);
  });
})