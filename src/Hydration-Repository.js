import Repository from "./Repository";
class Hydration extends Repository {
  constructor(dataset) {
    super(dataset);
  }

  returnDidUserDrinkEnoughWater(metric, user) {
    let waterDatas = this.returnMetricByWeek(metric, user);
    let avgWaterPerDay = (waterDatas.reduce((acc, day) => acc + day, 0) / 7);
    if (avgWaterPerDay > 64) {
      return true;
    }
    return false;
  }
}

export default Hydration;