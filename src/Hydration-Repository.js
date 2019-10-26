import Repository from "./Repository";
class Hydration extends Repository {
  constructor(dataset) {
    super(dataset);
  }

  returnDidUserDrinkEnoughWater(metric, newUser, dataset) {
    let waterDatas = this.returnMetricByWeek(metric, newUser.findCurrentUserData(dataset));
    let avgWaterPerDay = (waterDatas.reduce((acc, day) => acc + day, 0) / 7);
    if (avgWaterPerDay > 64) {
      return true;
    }
    return false;
  }
}

export default Hydration;