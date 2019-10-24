// import User from "./User";

class Repository {
  constructor(dataset) {
    this.data = dataset;
    this.date;
  }

  findUser(idNum) {
    return this.data.find(e => e.id === idNum);
  }

  returnAverage(metric, dataset = this.data) {
    if (metric === 'hoursSlept' || metric === 'sleepQuality') {
      return parseFloat((dataset.reduce((acc, curVal) => acc + curVal[metric], 0) / dataset.length).toFixed(1));
    } else {
      return Math.floor(dataset.reduce((acc, curVal) => acc + curVal[metric], 0) / dataset.length)
    }
  }

  findToday(dataset) {
    this.date = dataset[dataset.length - 1].date;
    return this.date
  }

  returnMetricByWeek(metric, user) {
    const dataset = user.findCurrentUserData(this.data);
    let index = dataset.findIndex(stats => stats.date === this.date);
    return dataset.map(stats => stats[metric]).splice(index - 6, 7);
  }

  returnMetricByDate(metric, user)  {
    const dataset = user.findCurrentUserData(this.data);
    return dataset.find(userMetric => userMetric.date === this.date)[metric];
  }
}


export default Repository;