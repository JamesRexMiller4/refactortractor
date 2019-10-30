const chai = require('chai');
const expect = chai.expect;

import Repository from '../src/Repository';
import User from '../src/User';
import Sleep from '../src/Sleep-Repository';
import userTestData from '../test-data/user-test-data';
import sleepTestData from '../test-data/sleep-test-data';

describe('Sleep', () => {
  let sleepRepo, user, userRepo, currentDate;
  beforeEach(() => {
    currentDate = '2019/09/15'
    userRepo = new Repository(userTestData);
    user = new User(userRepo.findUser(1));
    sleepRepo = new Sleep(sleepTestData);
    sleepRepo.findToday(sleepTestData)
  });
  
  it('should return a boolean indicating whether a user got enough sleep on a particular date', () => {
    sleepRepo.findToday(sleepRepo.data);
    expect(sleepRepo.checkUserRestedByDate(user.findCurrentUserData(sleepRepo.data), sleepRepo.date)).to.equal(true)
  });
});