const chai = require('chai');
const expect = chai.expect;

// import Repository from '../src/Repository';
import Hydration from '../src/Hydration-Repository';
import User from '../src/User';
import Repository from '../src/Repository';
import userTestData from '../test-data/user-test-data';
import hydrationTestData from '../test-data/hydration-test-data';

describe('Hydration', () => {
  let hydration; let user; let userRepo;
  beforeEach(() => {
    userRepo = new Repository(userTestData)
    hydration = new Hydration(hydrationTestData);
    user = new User(userRepo.findUser(1));
  });

  it('should return a boolean determining whether the user drank enough water for the last week', () => {
    expect(hydration.returnDidUserDrinkEnoughWater('numOunces', user)).to.equal(false);
  })
  
});