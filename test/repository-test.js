const chai = require('chai');
const expect = chai.expect;

import Repository from '../src/Repository';
import userTestData from '../test-data/user-test-data';
import sleepTestData from '../test-data/user-test-data';

describe('Repository', () => {
  let userRepo; let user; let sleepRepo;
  beforeEach(() => {
    userRepo = new Repository(userTestData);
    
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

  it.skip("should return an individual user's data", () => {
    expect(userRepo.returnUserData(1)).to.equal(userTestData[0]);
  });

  it.skip("should return the average step count of all users", () => {
    expect(userRepo.returnAllUsersAverageStepGoal()).to.equal(6666);
  });
})