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
    return dataset.filter(person => person.friends.includes(this.id)).map(user => user[info]);
  }

  rateFriends(repo, activeRepo) {
    const ids = [...this.friends, this.id];
    let friendsRepo =  repo.filter(activeUser => ids.includes(activeUser.id))
    friendsRepo.reduce((challengeData, friend) => {
      let userNew = new User(friend);
      challengeData.push({name: userNew['name'], steps: activeRepo.findTotalByWeek('numSteps', userNew.findCurrentUserData(activeRepo.data))});
      return challengeData;
    }, []).sort((userOne, userTwo) => userTwo.numSteps - userOne.numSteps);
  }
}
export default User;
