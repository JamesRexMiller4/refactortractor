import Repository from "./Repository";

class Sleep extends Repository {
  constructor(dataset) {
    super(dataset)
    this.isRested = false;
  }

  checkUserRestedByDate(dataset, date) {
    let found = dataset.find(data => data.date === date)
    if (found.hoursSlept >= 8) {
      return this.isRested = true;
    }
  }
}

export default Sleep;