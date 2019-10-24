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

  findFriendsInfo(repo, info) {
    return repo.data.filter(user => this.friends.includes(user.id)).map(user => user[info]);
  }

  rateFriends(repo, activity) {
    const ids = [...this.friends, this.id];
    return repo.data.filter(user => ids.includes(user.id)).reduce((challengeData, user) => {
      const userNew = new User(user);
      challengeData.push({name: userNew.name, steps: activity.findTotalByWeek('numSteps', userNew)});
      return challengeData;
    }, []).sort((userOne, userTwo) => userTwo.steps - userOne.steps);
  }
}
export default User;
