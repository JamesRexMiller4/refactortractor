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

  it("should be able to locate a user from the dataset", () => {
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

  describe('findToday method', () => {
    it("should be able to find the most current data point", () => {
      expect(hydroRepo.findToday(hydroRepo.data)).to.equal("2019/06/23");
      expect(sleepRepo.findToday(sleepRepo.data)).to.equal("2019/06/22");
      expect(activityRepo.findToday(activityRepo.data)).to.equal("2019/06/21");
    });
  });

  describe('returnAverage method', () => {
    it("should return the average metric for all users' data", () => {
      expect(userRepo.returnAverage('dailyStepGoal')).to.equal(6666);
      expect(hydroRepo.returnAverage('numOunces')).to.equal(61);
      expect(sleepRepo.returnAverage('hoursSlept')).to.equal(8.5);
      expect(sleepRepo.returnAverage('sleepQuality')).to.equal(3.1);
      expect(activityRepo.returnAverage('flightsOfStairs')).to.equal(20);
      expect(activityRepo.returnAverage('numSteps')).to.equal(7824);
      expect(activityRepo.returnAverage('minutesActive')).to.equal(164);
    });

    it("should return the average metric for a single user", () => {
      expect(hydroRepo.returnAverage('numOunces', user.findCurrentUserData(hydroRepo.data))).to.equal(59);
      expect(sleepRepo.returnAverage('sleepQuality', user.findCurrentUserData(sleepRepo.data))).to.equal(2.7);
      expect(sleepRepo.returnAverage('hoursSlept', user.findCurrentUserData(sleepRepo.data))).to.equal(8.3);
      expect(activityRepo.returnAverage('flightsOfStairs', user.findCurrentUserData(activityRepo.data))).to.equal(17);
      expect(activityRepo.returnAverage('numSteps', user.findCurrentUserData(activityRepo.data))).to.equal(8375);
      expect(activityRepo.returnAverage('minutesActive', user.findCurrentUserData(activityRepo.data))).to.equal(171);
    });
  });

  describe('returnMetricByWeek method', () => {
    it("should return a weeks worth of data points for a single user", () => {
      expect(hydroRepo.returnMetricByWeek('numOunces', user)).to.eql([96, 61, 91, 50, 50, 43, 39]);
      expect(sleepRepo.returnMetricByWeek('sleepQuality', user)).to.eql([3.8, 2.6, 3.1, 1.2, 1.2, 4.2, 3]);
      expect(sleepRepo.returnMetricByWeek('hoursSlept', user)).to.eql([4.1, 8, 10.4, 10.7, 9.3, 7.8, 10]);
      expect(activityRepo.returnMetricByWeek('flightsOfStairs', user)).to.eql([16, 36, 18, 33, 2, 12, 6]);
      expect(activityRepo.returnMetricByWeek('numSteps', user)).to.eql([3577, 6637, 14329, 4419, 8429, 14478, 6760]);
      expect(activityRepo.returnMetricByWeek('minutesActive', user)).to.eql([140, 175, 168, 165, 275, 140, 135]);
    });
  });
  
  describe('returnMetricByDate method', () => {
    it("should return a user's stats for a particular day", () => {
      hydroRepo.findToday(hydroRepo.data);
      sleepRepo.findToday(sleepRepo.data);
      activityRepo.findToday(activityRepo.data);
      expect(hydroRepo.returnMetricByDate('numOunces', user)).to.equal(39);
      expect(sleepRepo.returnMetricByDate('sleepQuality', user)).to.equal(3);
      expect(sleepRepo.returnMetricByDate('hoursSlept', user)).to.equal(10);
      expect(activityRepo.returnMetricByDate('flightsOfStairs', user)).to.equal(6);
      expect(activityRepo.returnMetricByDate('numSteps', user)).to.equal(6760);
      expect(activityRepo.returnMetricByDate('minutesActive', user)).to.equal(135);
    });
  });
});