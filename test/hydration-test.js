const chai = require('chai');
const expect = chai.expect;

// import Repository from '../src/Repository';
import Hydration from '../src/Hydration-Repository';
import hydrationTestData from '../test-data/hydration-test-data';

describe('Hydration', () => {
  let hydration;
  beforeEach(() => {
    hydration = new Hydration(hydrationTestData);
  });

  it.skip('should be a function', function() {
    expect(Hydration).to.be.a('function');
  });
  
  it.skip('should calculate average fluid ozs consumed per day for all time', function() {
    expect(hydration.returnAvgFluidOzPerDayAllTime(1)).to.equal(536);
  });

  it.skip('should calculate fluid ounces by specific date', function() {
    expect(hydration.returnFluidOzByDate(3, '2019/06/15')).to.equal(47);
  });

  it.skip('should calculate water consumption over a week period', function() {
    expect(hydration.returnFluidOzByWeek(3, '2019/06/21')).to.deep.eql([47, 99, 28, 40, 85, 51, 41]);
  });

  it.skip('should return a boolean determining whether the user drank enough water for the last week', () => {
    expect(hydration.returnDidUserDrinkEnoughWater(1, '2019/06/21')).to.equal(true);
  })
  
});