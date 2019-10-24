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
  
}
export default User;