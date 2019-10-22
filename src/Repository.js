class Repository {
  constructor(dataset) {
    this.data = dataset;
    this.date;
  }

  findUser(idNum) {
    return this.data.filter(e => e.id === idNum);
  }

  findAvg(metric, dataset) {
    return dataset.reduce((acc, curVal) => acc + curVal[metric], 0) / dataset.length;
  }

  findToday(dataset) {
    this.date = dataset[dataset.length - 1].date;
  }

  findMetricAllUsersByWeek(metric, dataset) {
    let index = dataset.findIndex(stats => stats.date === this.date);
    return dataset.map(stats => stats[metric]).splice(index - 6, 7);
  }

  returnMetricAllUsersByDate( infoType, metric)  {
    let dateMatch = infoType.filter((element) => element.date === date);
    let allUsersTotal = dateMatch.reduce((acc, cv) => acc + cv[metric], 0);
    return parseInt(allUsersTotal / dateMatch.length);
  }





}


export default Repository;