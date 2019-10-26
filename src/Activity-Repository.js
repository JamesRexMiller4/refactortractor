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

  returnMilesWalkedByDate(dataset, newUser) {	
    let numOfSteps = dataset.find(activityObj => activityObj.userID === newUser.id && activityObj.date === '2019/09/15').numSteps;	
    return parseInt(((numOfSteps * newUser.strideLength) / 5280).toFixed(0));	
  } 

  returnThreeDayStepStreak(dataset) {
    return dataset.reduce((acc, day, index) => {
      if (index < 2) {
        return acc;
      }
      if ((day.numSteps > dataset[index - 1].numSteps) && (dataset[index - 1].numSteps > dataset[index - 2].numSteps)) {
        acc.push({
          [dataset[index].date]: dataset[index].numSteps,
          [dataset[index - 1].date]: dataset[index - 1].numSteps,
          [dataset[index - 2].date]: dataset[index - 2].numSteps,
        });
      }
      return acc;
    }, []);
  }

  republicPlazaChallenge(dataset) {
    return parseInt((dataset.reduce((acc, day) => {
      acc += day.flightsOfStairs;
      return acc;
    }, 0) / 56));
  }

}

export default Activity;