import $ from 'jquery';

import User from './User';
import Repository from './Repository';
import Activity from './Activity-Repository';
import Hydration from './Hydration-Repository';
import Sleep from './Sleep-Repository';

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.scss';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/building.svg'
import './images/coffin.svg'
import './images/ghost (1).svg'
import './images/ghost-happy.svg'
import './images/ghost-sad.svg'
import './images/glass-empty.svg'
import './images/glass-full.svg'
import './images/user-lightmode.svg'
import './images/sleep-lightmode.svg'
import './images/water-lightmode.svg'
import './images/activities-lightmode.svg'
import './images/user-darkmode.svg'
import './images/sleep-darkmode.svg'
import './images/water-darkmode.svg'
import './images/activities-darkmode.svg'

import Chart from 'chart.js';

let user;
let repository;
let hydration;
let sleep;
let activity;
let usersFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
.then(data => data.json())
.catch(error => console.error('NO DATA'));
let hydrationFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
.then(data => data.json())
.catch(error => console.error('NO DATA'));
let sleepFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
.then(data => data.json())
.catch(error => console.error('NO DATA'));
let activityFetch = fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
.then(data => data.json())
.catch(error => console.error('NO DATA'));

Promise.all([usersFetch, hydrationFetch, sleepFetch, activityFetch])
.then( allData => {
  const [usersFetch, hydrationFetch, sleepFetch, activityFetch] = allData;
  const userData = usersFetch;
  const hydrationData = hydrationFetch;
  const sleepData = sleepFetch;
  const activityData = activityFetch;
  repository = new Repository(userData);
  const userIdNum = generateRandomUserId();
  user = new User(userIdNum);
  hydration = new Hydration(hydrationData);
  sleep = new Sleep(sleepData);
  activity = new Activity(activityData);
  console.log('one', repository)
})
console.log('two', repository)


const currentDate = '2019/06/30';
const friendNames = returnFriendListNames();
const friendSteps = returnFriendListSteps();
const stepsTrend = (activity.returnThreeDayStepStreak(user.id)[0]);

$('#user-name').text(user.returnUserFirstName());
$('#current-date').text(currentDate);
$('#user-info-name').text(user.name);
$('#user-info-email').text(user.email);
$('#user-info-address').text(user.address);
$('#user-info-step-goal').text(user.dailyStepGoal);
$('#user-water-by-day').text(hydration.returnMetricByDate('numOunces', user));
$('#user-sleep-by-day').text(sleep.returnMetricByDate('hoursSlept', user));
$('#user-sleep-quality-by-day').text(sleep.returnMetricByDate('sleepQuality', user));
$('#user-sleep-by-week').text(sleep.returnMetricByWeek('hoursSlept', user));
$('#user-sleep-quality-by-week').text(sleep.returnMetricByWeek('sleepQuality', user));
$('#user-average-sleep-quality').text(sleep.returnAverage('sleepQuality', user));
$('#user-average-hours-slept').text(sleep.returnAverageSleep(user.id));
$('#user-current-step-count').text(activity.returnMetricByDate('numSteps', user));
$('#user-rested').text(displaySleepStatus());
$('#user-current-mins-active').text(activity.returnMetricByDate('minutesActive', user));
$('#user-current-miles-walked').text(activity.returnMilesWalkedByDate(user));
$('#user-current-step-count-vs-average').text(activity.returnAverage('numSteps', user));
$('#all-users-average-step-count').text(activity.returnAverage('numSteps'));
$('#user-current-stairs-climbed').text(activity.returnAverage('flightsOfStairs', user));
$('#all-users-average-stairs-climbed').text(activity.returnAverage('flightsOfStairs'));
$('#user-current-active-mins').text(activity.returnAverage('minutesActive', user));
$('#all-users-average-active-mins').text(activity.returnAverage('minutesActive'));
$('#user-step-count-by-week').text(activity.returnMetricByWeek('numsSteps', user))
$('#user-stairs-climbed-by-week').text(activity.returnMetricByWeek('flightsOfStairs', user))
$('#user-mins-active-by-week').text(activity.returnMetricByWeek('minutesActive', user))
$('#winner-name').text(returnFriendChallengeWinner(friendNames))
$('#user-water-trend-week').text(displayWaterStatus());
$('#republic-plaza-challenge').text(activity.republicPlazaChallenge(user.id));

function generateRandomUserId() {
  let randomNumOneToFifty = (Math.random() * 50);
  return Math.ceil(randomNumOneToFifty);
}

function displaySleepStatus() {
  sleep.checkUserRestedByDate(user)
  if (sleep.isRested === true) {
    $('#sleep-status').attr({src: '../images/ghost-happy.svg', alt: 'happy ghost icon'});
    $('#sleep-staus')
    $('#sleep-comment').text('You\'ve been getting enough sleep!');
  } else {
    $('#sleep-status').attr({src: '../images/ghost-sad.svg', alt: 'sad ghost icon'});
    $('#sleep-comment').text('Getting 8 hours of sleep will make you more productive!');
  }
}

function displayWaterStatus() {
  let checkWater = hydration.returnDidUserDrinkEnoughWater(user.id, currentDate)
  if (checkWater === true) {
    $('#water-status').attr({src: '../images/glass-full.svg', alt: 'full water glass icon'});
    $('#water-comment').text('Keep up the good work! You\'ve averaged more than 64 ounces per day this week');
  } else {
    $('#water-status').attr({src: '../images/glass-empty.svg', alt: 'empty water glass icon'});
    $('#water-comment').text('You need more water. Make sure you\'re staying hydrated!');
  }
}

function populateFriends(userFriends) {
  let friends = userFriends.map(friend => {
    let userFriend = new User(repository.returnUserData(friend))
    return ({
      id: userFriend.id,
      name: userFriend.returnUserFirstName(),
      steps: (activity.returnNumberOfStepsByWeek(userFriend.id, currentDate)).reduce((acc, day) => acc += day)})
  });
  friends.push(populateUserDataForFriendChallenge());
  return friends.sort((userA, userB) => userB.steps - userA.steps);
}

function populateUserDataForFriendChallenge() {
  return {
    id: user.id,
    name: newUser.returnUserFirstName(),
    steps: activity.returnNumberOfStepsByWeek(user.id,currentDate)
      .reduce((acc, day) => acc += day)
  }
}

function returnFriendListNames() {
  let friendObjs = populateFriends(user.friends);
  return friendObjs.map(friend => friend.name);
}

function returnFriendListSteps() {
  let friendObjs = populateFriends(user.friends);
  return friendObjs.map(friend => friend.steps);
}

function returnFriendChallengeWinner(friendNames) {
  if (friendNames[0] === newUser.returnUserFirstName()) {
    return `You win!!`;
  }
  return `${friendNames[0]} is the Winner!`
}

function returnDatesOfWeek(userId, date) {
  let userData = activity.findCurrentUserData(userId);
  let index = userData.findIndex((data) => data.date === date);
  return userData.splice(index - 6, 7).map(day => day.date);
}

Chart.defaults.global.defaultFontColor = 'black';
var ctx = $('#user-water-by-week');
var hydrationByWeek = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'ounces',
      data: hydration.returnFluidOzByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-sleep-by-week');
var sleepQualityHrsByWeek = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'hours',
      data: sleep.returnSleepByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    },
    {
      label: 'quality score',
      data: sleep.returnSleepQualityByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',

      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
      type: 'line',
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-step-count-by-week');
var stepsByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'steps',
      data: activity.returnNumberOfStepsByWeek(user.id, currentDate),
      backgroundColor: [
        'rgba(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    },
  ]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-mins-active-by-week');
var activityByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'active minutes',
      data: activity.returnActiveMinutesByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#user-stairs-climbed-by-week');
var stairsByWeek = new Chart(ctx, {
  type: 'line',
  data: {
    labels: returnDatesOfWeek(user.id, currentDate),
    datasets: [{
      label: 'stairs climbed',
      data: activity.returnStairsClimbedByWeek(user.id, currentDate),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#friend-info');
var friendStepChallenge = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: friendNames,
    datasets: [{
      label: 'steps',
      data: friendSteps,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(221, 160, 221, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

var ctx = $('#step-trend');
var stepTrend = new Chart(ctx, {
  type: 'line',
  data: {
    labels: Object.keys(stepsTrend).reverse(),
    datasets: [{
      label: 'steps',
      data: Object.values(stepsTrend).reverse(),
      backgroundColor: [
        'rgb(221, 160, 221, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(192, 192, 192, 0.2)'
      ],
      borderColor: [
        'rgba(221, 160, 221, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(192, 192, 192, 1)'
      ],
      borderWidth: 1
    }]
  },
  options: {
    legend: {},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});

// *** EVENT LISTENERS FOR HEADER ***
$('.toggle label').on('click', function() {
  if ($(this).siblings().prop('checked')) {
    changeMode('light');
  } else {
    changeMode('dark');
  }
  Chart.defaults.global.defaultFontColor = $('body').css('--base-color');
});

$('.icons li img').on('click', function() {
  const $widget = $(this).data('type');
  const $block = $('#user-admin-info');
  if ($block.data('type') === $widget) {
    $block.data('type', '').hide();
  } else {
    $block.show().children(`.${$widget}-inputs`).show().siblings().hide();
    $block.data('type', $widget);
  }
});

$('#user-admin-info').on('mouseleave', function() {
  $('#user-admin-info').data('type', '').hide();

});

$('.dropdown header').on('click', function() {
  $('.dropdown div').toggle();
});

$('.dropdown div p').on('click', function() {
  $('.dropdown header p').text($(this).text());
  $('.dropdown input').val($(this).text());
  $(this).parent().hide();
});

$('.triple-block ul li').on('click', function() {
  const $number = $(this).data('number');
  $(`.triple-block section:nth-child(${$number})`).show().siblings('section').hide();
  $(this).css({'font-weight': '700',
  'border-bottom': '1px solid var(--base-color)'});
  $(this).siblings().css({'font-weight': '400',
  'border-bottom': 'none'});
});

function changeMode(mode) {
  const dark = {'--bcg-color': '#111f28', '--section-bcg-color': '#484e52', '--base-color': '#ffffff', '--accent-color': '#dda0dd'};
  const light = {'--bcg-color': '#c0dbf5', '--section-bcg-color': '#eff7ff', '--base-color': '#000000', '--accent-color': '#214FBA'};
  (mode === 'dark') ? $('body').css(dark) : $('body').css(light);
  $('.icon').each(function() {
    let $iconType = $(this).data('type');
    $(this).attr('src', `./images/${$iconType}-${mode}mode.svg`);
  });
}
