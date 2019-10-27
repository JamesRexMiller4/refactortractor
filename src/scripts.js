import $ from 'jquery';
import pattern from 'patternomaly';

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
let friendNames;
let friendSteps;

Promise.all([
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/users/userData')
    .then(data => data.json())
    .then(data => data.userData)
    .catch(error => console.error('NO DATA')),
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData')
    .then(data => data.json())
    .then(data => data.hydrationData)
    .catch(error => console.error('NO DATA')),
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData')
    .then(data => data.json())
    .then(data => data.sleepData)
    .catch(error => console.error('NO DATA')),
  fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData')
    .then(data => data.json())
    .then(data => data.activityData)
    .catch(error => console.error('NO DATA'))
]).then(data => {
  repository = new Repository(data[0]);
  const userIdNum = generateRandomUserId();
  const currentUser = repository.findUser(userIdNum);
  user = new User(currentUser);
  hydration = new Hydration(data[1]);
  sleep = new Sleep(data[2]);
  activity = new Activity(data[3]);
  repository.findToday(activity.data);
}).then(() => {
  updateBoard();
  updateCharts();
})

function updateBoard() {
  friendNames = user.findFriendsInfo(repository.data, 'name');
  friendSteps = user.findFriendsInfo(repository.data, 'dailyStepGoal');

  const currentDate = '2019/09/15';
  const userSleepData = user.findCurrentUserData(sleep.data)
  const userHydroData = user.findCurrentUserData(hydration.data)
  const userActivityData = user.findCurrentUserData(activity.data)

  $('#user-name').text(user.returnUserFirstName());
  $('#current-date').text(currentDate);
  $('#user-info-name').text(user.name);
  $('#user-info-email').text(user.email);
  $('#user-info-address').text(user.address);
  $('#user-info-step-goal').text(user.dailyStepGoal);
  $('#user-water-by-day').text(hydration.returnMetricByDate('numOunces', userHydroData, currentDate));
  $('#user-sleep-by-day').text(sleep.returnMetricByDate('hoursSlept', userSleepData, currentDate));
  $('#user-sleep-quality-by-day').text(sleep.returnMetricByDate('sleepQuality', userSleepData, currentDate));
  $('#user-sleep-by-week').text(sleep.returnMetricByWeek('hoursSlept', userSleepData));
  $('#user-sleep-quality-by-week').text(sleep.returnMetricByWeek('sleepQuality', userSleepData));
  $('#user-average-sleep-quality').text(sleep.returnAverage('sleepQuality', userSleepData));
  $('#user-average-hours-slept').text(sleep.returnAverage('hoursSlept', userSleepData));
  $('#user-current-step-count').text(activity.returnMetricByDate('numSteps', userActivityData, currentDate));
  $('#user-rested').text(displaySleepStatus());
  $('#user-current-mins-active').text(activity.returnMetricByDate('minutesActive', userActivityData, currentDate));
  $('#user-current-miles-walked').text(activity.returnMilesWalkedByDate(userActivityData, user));
  $('#user-current-step-count-vs-average').text(activity.returnAverage('numSteps', userActivityData));
  $('#all-users-average-step-count').text(activity.returnAverage('numSteps'));
  $('#user-current-stairs-climbed').text(activity.returnAverage('flightsOfStairs', userActivityData));
  $('#all-users-average-stairs-climbed').text(activity.returnAverage('flightsOfStairs'));
  $('#user-current-active-mins').text(activity.returnAverage('minutesActive', userActivityData));
  $('#all-users-average-active-mins').text(activity.returnAverage('minutesActive'));
  $('#user-step-count-by-week').text(activity.returnMetricByWeek('numsSteps', userActivityData))
  $('#user-stairs-climbed-by-week').text(activity.returnMetricByWeek('flightsOfStairs', userActivityData))
  $('#user-mins-active-by-week').text(activity.returnMetricByWeek('minutesActive', userActivityData))
  // $('#winner-name').text(returnFriendChallengeWinner(user, activity.data))
  $('#user-water-trend-week').text(displayWaterStatus());
  $('#republic-plaza-challenge').text(activity.republicPlazaChallenge(userActivityData));
}

function generateRandomUserId() {
  let randomNumOneToFifty = (Math.random() * 50);
  return Math.ceil(randomNumOneToFifty);
}

function displaySleepStatus() {
  sleep.checkUserRestedByDate(user.findCurrentUserData(sleep.data), '2019/09/15')
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
  let checkWater = hydration.returnDidUserDrinkEnoughWater('numOunces', user, hydration.data)
  if (checkWater === true) {
    $('#water-status').attr({src: '../images/glass-full.svg', alt: 'full water glass icon'});
    $('#water-comment').text('Keep up the good work! You\'ve averaged more than 64 ounces per day this week');
  } else {
    $('#water-status').attr({src: '../images/glass-empty.svg', alt: 'empty water glass icon'});
    $('#water-comment').text('You need more water. Make sure you\'re staying hydrated!');
  }
}

function returnFriendChallengeWinner(newUser, activityRepo) {
  const names = newUser.rateFriends(repository.data, activityRepo);
  console.log(names)
  if (names[0] === newUser.name) {
    return `You win!!`;
  }
  return `${names[0]} is the Winner!`
}

function updateCharts() {
  const stepsTrend = activity.returnThreeDayStepStreak(user.findCurrentUserData(activity.data))[0];
  friendNames = user.findFriendsInfo(repository.data, 'name');
  friendSteps = user.findFriendsInfo(repository.data, 'dailyStepGoal');

  Chart.defaults.global.defaultFontColor = 'black';
  const weekDays = repository.findWeekDays(sleep.data);

  var ctx = $('#user-water-by-week');
  const weekHydroUserInfo = hydration.returnMetricByWeek('numOunces', user.findCurrentUserData(hydration.data));
  weekHydroUserInfo.forEach((el, i) => {
    ctx.append(`
      <span class='screen-reader-text'>${el} ounces were drinked on ${weekDays[i]}.</span>
    `);
  });

  var hydrationByWeek = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'ounces',
        data: weekHydroUserInfo,
        backgroundColor: [
          pattern.draw('square', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('disc', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('cross', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dash', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dot', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('diamond', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('triangle', 'rgba(54, 162, 235, 0.8)')
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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
  const weekSleepQualityUserInfo = sleep.returnMetricByWeek('sleepQuality', user.findCurrentUserData(sleep.data));
  weekSleepQualityUserInfo.forEach((el, i) => {
    ctx.append(`
      <span class='screen-reader-text'> On ${weekDays[i]} your sleep quality was ${el}.</span>
    `);
  });

  const weekSleepHoursUserInfo = sleep.returnMetricByWeek('hoursSlept', user.findCurrentUserData(sleep.data));
  weekSleepHoursUserInfo.forEach((el, i) => {
    ctx.append(`
      <span class='screen-reader-text'>On ${weekDays[i]} you slept ${el} hours.</span>
    `);
  });
  var sleepQualityHrsByWeek = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'quality score',
        data: weekSleepQualityUserInfo,
        backgroundColor: [
          'rgb(0,0,128, 0.2)',
        ],
        borderColor: [
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)',
          'rgba(0,0,128, 1)'
        ],
        borderWidth: 1,
        type: 'line',
      },{
        label: 'hours',
        data: weekSleepHoursUserInfo,
        backgroundColor: [
          pattern.draw('square', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('disc', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('cross', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dash', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dot', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('diamond', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('triangle', 'rgba(54, 162, 235, 0.8)')
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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

  var ctx = $('#user-step-count-by-week');
  const stepsUser = activity.returnMetricByWeek('numSteps', user.findCurrentUserData(activity.data));
  stepsUser.forEach((el, i) => {
    ctx.append(`
      <span class='screen-reader-text'>On ${weekDays[i]} you made ${el} steps.</span>
    `);
  });

  var stepsByWeek = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'steps',
        data: stepsUser,
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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
  const minutesUser = activity.returnMetricByWeek('minutesActive', user.findCurrentUserData(activity.data));
  var activityByWeek = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'active minutes',
        data: minutesUser,
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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
  const flightsUser = activity.returnMetricByWeek('flightsOfStairs', user.findCurrentUserData(activity.data));
  var stairsByWeek = new Chart(ctx, {
    type: 'line',
    data: {
      labels: weekDays,
      datasets: [{
        label: 'stairs climbed',
        data: flightsUser,
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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
  friendSteps.forEach((el, i) => {
    ctx.append(`
      <span class='screen-reader-text'>${friendNames[i]} made ${el} steps.</span>
    `);
  });
  var friendStepChallenge = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: friendNames,
      datasets: [{
        label: 'steps',
        data: friendSteps,
        backgroundColor: [
          pattern.draw('square', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('disc', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('cross', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dash', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dot', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('diamond', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('triangle', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dash', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('dot', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('diamond', 'rgba(54, 162, 235, 0.8)'),
          pattern.draw('triangle', 'rgba(54, 162, 235, 0.8)')
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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
  Object.keys(stepsTrend).forEach(el => {
    ctx.append(`
      <span class='screen-reader-text'>${stepsTrend[el]} steps were made on ${el}</span>
    `);
  });
  var stepTrend = new Chart(ctx, {
    type: 'line',
    data: {
      labels: Object.keys(stepsTrend).reverse(),
      datasets: [{
        label: 'steps',
        data: Object.values(stepsTrend).reverse(),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(54, 162, 235, 1)'
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

}


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
  const $block = $(this).siblings('container');
  $block.toggle();
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
  changeScreenReader(activity, user, $number);
});

function changeScreenReader(activity, user, number) {
  const block = $(`.triple-block section:nth-child(${number})`);
  const metric = block.data('type');
  const metricName = block.data('values');
  const weekDays = activity.findWeekDays(activity.data);
  const stepsUser = activity.returnMetricByWeek(metric, user.findCurrentUserData(activity.data));
  block.children('canvas').children('span').remove();
  stepsUser.forEach((el, i) => {
    block.children('canvas').append(`
      <span class='screen-reader-text'>On ${weekDays[i]} you made ${el} ${metricName}.</span>
    `);
  });
}

function changeMode(mode) {
  const dark = {'--bcg-color': '#111f28', '--section-bcg-color': '#484e52', '--base-color': '#ffffff', '--accent-color': '#dda0dd'};
  const light = {'--bcg-color': '#c0dbf5', '--section-bcg-color': '#eff7ff', '--base-color': '#000000', '--accent-color': '#214FBA'};
  (mode === 'dark') ? $('body').css(dark) : $('body').css(light);
  $('.icons img').each(function() {
    let $iconType = $(this).data('type');
    $(this).attr('src', `./images/${$iconType}-${mode}mode.svg`);
  });
}

$('.inputs button').on('click', function() {
  const $vals = $(this).siblings('input');
  const type = $(this).data('type');
  let results = [];
  $vals.each(function() {
    results = [...results, /\d/g.test($(this).val())];
  });
  if (!results.includes(false)) {
    switchFetch(type, $vals);
  }
  $(this).parent().trigger("reset");
});

function switchFetch(type, values) {
  switch (type) {
    case 'sleep':
      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/sleep/sleepData', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: user.id,
          date: repository.date,
          hoursSlept: parseFloat($(values[0]).val()),
          sleepQuality: parseFloat($(values[1]).val())
        })
      });
      break;
    case 'hydration':
      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/hydration/hydrationData', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: user.id,
          date: repository.date,
          numOunces: parseInt($(values).val())
        })
      });
      break;
    case 'activity':
      fetch('https://fe-apps.herokuapp.com/api/v1/fitlit/1908/activity/activityData', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userID: user.id,
          date: repository.date,
          numSteps: parseInt($(values[0]).val()),
          minutesActive: parseInt($(values[1]).val()),
          flightsOfStairs: parseInt($(values[2]).val())
        })
      });
      break;
  }
}

$('.icons li>img').on('keydown', function(event) {
  if (event.keyCode === 13) {
    $(this).click();
  }
});

$('.toggle').on('keydown', function(event) {
  if (event.keyCode === 13) {
    $(this).children('label').click();
  }
});

$('.dropdown').on('keydown', function() {
  if (event.keyCode === 13) {
    $(this).children('header').click();
  }
});

$('.dropdown div>p').on('keydown', function() {
  if (event.keyCode === 13) {
    $(this).click();
  }
});

$('.inputs button').on('keydown', function() {
  if (event.keyCode === 13) {
    $(this).click();
  }
});

$('.triple-block ul>li').on('keydown', function() {
  if (event.keyCode === 13) {
    $(this).click();
  }
});
