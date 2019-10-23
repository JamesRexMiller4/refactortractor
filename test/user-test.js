const chai = require('chai');
const expect = chai.expect;

import User from '../src/User';
import sleepData from '../test-data/sleep-test-data';

describe('User', function() {
  let user;
  beforeEach(() => {
    user = new User ({
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

  it.skip('should be a function', function() {
    expect(User).to.be.a('function');
  });

  it.skip('should be an instance of User', function() {
    expect(user).to.be.an.instanceof(User);
  });

  it.skip('should return the first name', function() {
    expect(user.returnUserFirstName()).to.equal('Luisa');
  })

  it.skip('should be able to find the current user data amongst all datasets', function() {


  })
});