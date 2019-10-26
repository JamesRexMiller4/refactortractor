class Repository {
  constructor(dataset) {
    this.data = dataset;
    this.date;
    this.currentUser;
  }

  findUser(idNum) {
    const user = this.data.find(e => e.id === idNum);
    this.currentUser = user.id;
    return user;
  }

  returnAverage(metric, dataset = this.data) {
    console.log(dataset)
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

  findWeekDays(dataset) {
    const datesWeek = dataset.reduce((allDates, data) => {
      if (!allDates.includes(data.date)) {
        allDates.push(data.date);
      }
      return allDates;
    }, []).splice(this.length - 8, 7);
    return datesWeek;
  }

  findTotalByWeek(metric, dataset) {
    return dataset.returnMetricByWeek(metric, dataGroup).reduce((sum, data) => sum + data, 0);
  }

  returnMetricByWeek(metric, dataset) {
    let index = dataset.findIndex(stats => stats.date === this.date);
    return dataset.map(stats => stats[metric]).splice(index - 6, 7);
  }

  returnMetricByDate(metric, user, data, date)  {
    const dataset = user.findCurrentUserData(data);
    let found = dataset.find(stat => stat.date === date)
    return found[metric];
  }
}


export default Repository;
