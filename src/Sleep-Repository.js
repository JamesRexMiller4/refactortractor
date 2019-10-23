import Repository from "./Repository";

class Sleep extends Repository {
  constructor(dataset) {
    super(dataset)
    this.isRested = false;
  }

  checkUserRestedByDate(user) {
    if ((user.findCurrentUserData().find(data => {
      return data.date === this.date;
    }).hoursSlept) >= (8)) {
      return this.isRested = true;
    }
  }
}

export default Sleep;