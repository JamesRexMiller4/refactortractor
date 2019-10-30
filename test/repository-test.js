const chai = require('chai');
const expect = chai.expect;

import Repository from '../src/Repository';
import User from '../src/User';
import Sleep from '../src/Sleep-Repository';
import Hydration from '../src/Hydration-Repository'
import Activity from '../src/Activity-Repository';
import userTestData from '../test-data/user-test-data';
import sleepTestData from '../test-data/sleep-test-data';
import hydroTestData from '../test-data/hydration-test-data';
import activityTestData from '../test-data/activity-test-data';

describe('Repository', () => {
  let userRepo, user, sleepRepo, hydroRepo, activityRepo;
  beforeEach(() => {
    userRepo = new Repository(userTestData);
    user = new User(userRepo.findUser(1));
    sleepRepo = new Sleep(sleepTestData);
    hydroRepo = new Hydration(hydroTestData);
    activityRepo = new Activity(activityTestData);
  });

  it("should be able to locate a user from the dataset", () => {
    expect(userRepo.findUser(1)).to.deep.equal({
      "id": 1,
      "name": "Luisa Hane",
      "address": "15195 Nakia Tunnel, Erdmanport VA 19901-1697",
      "email": "Diana.Hayes1@hotmail.com",
      "strideLength": 4.3,
      "dailyStepGoal": 10000,
      "friends": [ 2, 3 ]
    });
  });

  describe('findToday method', () => {
    it("should be able to find the most current data point", () => {
      expect(hydroRepo.findToday(hydroRepo.data)).to.equal("2019/06/23");
    });
  });

  describe('findWeekDays method', () => {
    it("should return a week's dates", () => {
      expect(userRepo.findWeekDays(sleepTestData)).to.deep.equal([ '2019/06/15',
      '2019/06/16',
      '2019/06/17',
      '2019/06/18',
      '2019/06/19',
      '2019/06/20',
      '2019/06/21' ]);
    });
  })

  describe('returnAverage method', () => {
    it("should return the average metric for all users' data", () => {
      expect(sleepRepo.returnAverage('hoursSlept')).to.equal(8.5);
    });

    it("should return the average metric for a single user", () => {
      expect(sleepRepo.returnAverage('sleepQuality', user.findCurrentUserData(sleepRepo.data))).to.equal(2.7);
    });
  });

  describe('findTotalByWeek method', () => {
    it("should return a week's total of stats for Friend's Challenge", () => {
      expect(activityRepo.findTotalByWeek('numSteps', user.findCurrentUserData(activityRepo.data))).to.equal(58629);
    });
  })

  describe('returnMetricByWeek method', () => {
    it("should return a weeks worth of data points for a single user", () => {
      expect(sleepRepo.returnMetricByWeek('sleepQuality', user.findCurrentUserData(sleepRepo.data))).to.eql([3.8, 2.6, 3.1, 1.2, 1.2, 4.2, 3]);
    });
  });

  describe('returnMetricByDate method', () => {
    it("should return a user's stats for a particular day", () => {
      sleepRepo.findToday(sleepRepo.data);
      expect(sleepRepo.returnMetricByDate('hoursSlept', user.findCurrentUserData(sleepRepo.data), sleepRepo.date)).to.equal(10);
    });
  });
});
