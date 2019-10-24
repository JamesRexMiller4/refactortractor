import Repository from "./Repository";

class Activity extends Repository {
  constructor(dataset) {
    super(dataset);
  }

  checkStepGoalMetByDate(dataset, user) {
    if ((user.dailyStepGoal) <= (user.findCurrentUserData(dataset).find(elem => elem.date === this.date).numSteps)) {
      return true;
    }
    return false; 
  } 

  returnAvgActiveMinutesByWeek(dataset, user) {
    let index = user.findCurrentUserData(dataset).findIndex((activityObj) => activityObj.date === this.date);
    let userActiveMins = user.findCurrentUserData(dataset).map(activityObj => activityObj.minutesActive).splice(index - 6, 7);
    return (userActiveMins.reduce((totalMins, dailyActiveMins) => totalMins + dailyActiveMins, 0) / 7);
  } 

  returnMilesWalkedByDate(user) {	
    let numOfSteps = this.data.find(activityObj => activityObj.userID === user.id && activityObj.date === this.date).numSteps;	
    return parseInt(((numOfSteps * user.strideLength) / 5280).toFixed(0));	
  } 

  returnThreeDayStepStreak(dataset, user) {
    let userData = user.findCurrentUserData(dataset);
    return userData.reduce((acc, day, index) => {
      if (index < 2) {
        return acc;
      }
      if ((day.numSteps > userData[index - 1].numSteps) && (userData[index - 1].numSteps > userData[index - 2].numSteps)) {
        acc.push({
          [userData[index].date]: userData[index].numSteps,
          [userData[index - 1].date]: userData[index - 1].numSteps,
          [userData[index - 2].date]: userData[index - 2].numSteps,
        });
      }
      return acc;
    }, []);
  }

  republicPlazaChallenge(dataset, user) {
    let userData = user.findCurrentUserData(dataset);
    return parseInt((userData.reduce((acc, day) => {
      acc += day.flightsOfStairs;
      return acc;
    }, 0) / 56));
  }

}

export default Activity;