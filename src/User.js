class User {
  constructor(userData) {
    Object.assign(this, userData)
  }

  returnUserFirstName() {
    return this.name.split(' ')[0];
  }

  findCurrentUserData(dataset) {
    return dataset.filter(obj => obj.userID === this.id);
  }

  findFriendsInfo(dataset, info) {
    return dataset.filter(person => this.friends.includes(person.id)).map(user => user[info]);
  }

  rateFriends(repo, activity) {
    const ids = [...this.friends, this.id];
    let friendsRepo =  repo.filter(activeUser => ids.includes(activeUser.id));
    let results = friendsRepo.reduce((challengeData, friend) => {
      let userNew = new User(friend);
      let steps = activity.findTotalByWeek('numSteps', userNew.findCurrentUserData(activity.data));
      challengeData.push({name: userNew.returnUserFirstName(), steps: parseInt(steps)});
      return challengeData;
    }, []);
    let sorted = results.sort((userOne, userTwo) => userTwo.steps - userOne.steps);
    return sorted;
  }
}
export default User;
