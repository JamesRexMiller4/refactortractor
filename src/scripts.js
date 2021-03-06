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

let user,
    repository,
    hydration,
    sleep,
    activity;
let friendNames = [],
    friendSteps = [];
let userSleepData,
    userHydroData,
    userActivityData;
let currentDate;

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
  repository.findToday(hydration.data);
}).then(() => {
  updateBoard();
  updateCharts('black');
})

function updateBoard() {
  currentDate = '2019/09/15';
  userSleepData = user.findCurrentUserData(sleep.data);
  userHydroData = user.findCurrentUserData(hydration.data);
  userActivityData = user.findCurrentUserData(activity.data);

  $('#user-name').text(user.returnUserFirstName());
  $('#current-date').text(currentDate);
  updateUserInfo();
  updateWaterUserInfo();
  updateSleepUserInfo();
  updateActivityUserInfo();
  updateFriendChallenge();
}

function updateUserInfo() {
  let info = ['name', 'email', 'address', 'dailyStepGoal'];
  info.forEach(el => {
    $(`.user-inputs span[data-info=${el}]`).text(user[el]);
  })
}

function updateWaterUserInfo() {
    $('#user-water-by-day').text(hydration.returnMetricByDate('numOunces', userHydroData, currentDate));
    $('#user-water-by-average').text(hydration.returnAverage('numOunces', userHydroData));
    $('#user-water-trend-week').text(displayWaterStatus());
}

function updateSleepUserInfo() {
  let info = ['hoursSlept', 'sleepQuality'];
  info.forEach(el => {
    $(`#user-sleep-day p[data-info=${el}]`).text(sleep.returnMetricByDate(el, userSleepData, currentDate));
    $(`#user-average-sleep p[data-info=${el}]`).text(sleep.returnAverage(el, userSleepData));
  });
  $('#user-rested').text(displaySleepStatus());
}

function updateActivityUserInfo() {
  let info = ['numSteps', 'minutesActive', 'flightsOfStairs'];
  info.forEach(el => {
    $(`#user-activity-day p[data-info=${el}]`).text(activity.returnMetricByDate(el, userActivityData, currentDate));
    $(`.you-vs-world span[data-info="user-${el}"]`).text(activity.returnAverage(el, userActivityData));
    $(`.you-vs-world span[data-info="all-${el}"]`).text(activity.returnAverage(el));
  });
  $('#user-activity-day p[data-info="miles"]').text(activity.returnMilesWalkedByDate(userActivityData, user));
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

function updateFriendChallenge() {
  user.rateFriends(repository.data, activity).forEach(person => {
    if (person.name !== user.returnUserFirstName()) {
      friendNames.push(person.name);
      friendSteps.push(person.steps);
    } else {
      friendNames.push('You');
      friendSteps.push(person.steps);
    }
  });
  $('#winner-name').text(returnFriendChallengeWinner(user, activity));
}

function returnFriendChallengeWinner(newUser, activityRepo) {
  const names = newUser.rateFriends(repository.data, activityRepo);
  if (names[0].name === newUser.returnUserFirstName()) {
    return `You win!!`;
  }
  return `${names[0].name} is the Winner!`
}

function updateCharts(color) {
  Chart.defaults.global.defaultFontColor = color;
  const weekDays = repository.findWeekDays(sleep.data);
  updateChartWaterByWeek(weekDays);
  updateChartSleepByWeek(weekDays);
  updateChartStepsByWeek(weekDays);
  updateChartMinutesByWeek(weekDays);
  updateChartStairsByWeek(weekDays);
  updateFriendChallengeChart();
  updateStepTrendChart();
}

function updateChartWaterByWeek(weekDays) {
  var ctx = $('#user-water-by-week');
  const weekHydroUserInfo = hydration.returnMetricByWeek('numOunces', userHydroData);
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
}

function updateChartSleepByWeek(weekDays) {
  var ctx = $('#user-sleep-by-week');
  const weekSleepQualityUserInfo = sleep.returnMetricByWeek('sleepQuality', userSleepData);
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
}

function updateChartStepsByWeek(weekDays) {
  var ctx = $('#user-step-count-by-week');
  const stepsUser = activity.returnMetricByWeek('numSteps', userActivityData);
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
}

function updateChartMinutesByWeek(weekDays) {
  var ctx = $('#user-mins-active-by-week');
  const minutesUser = activity.returnMetricByWeek('minutesActive', userActivityData);
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
}

function updateChartStairsByWeek(weekDays) {
  var ctx = $('#user-stairs-climbed-by-week');
  const flightsUser = activity.returnMetricByWeek('flightsOfStairs', userActivityData);
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
}

function updateFriendChallengeChart() {
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
}

function updateStepTrendChart() {
  const stepsTrend = activity.returnThreeDayStepStreak(userActivityData)[0];
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

// *** EVENT LISTENERS ***
$('body').on('keydown', function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    $(event.target).click();
  }
});

$('.toggle label').on('click', function() {
  if ($(this).siblings().prop('checked')) {
    changeMode('light');
    updateCharts('dark');
  } else {
    changeMode('dark');
    updateCharts('white');
  }
});

$('.icons li img').on('click', function() {
  const $block = $(this).siblings('container');
  $block.toggle();
});

$('.dropdown header').on('click', function() {
  $('.dropdown div').toggle();
});

$('.dropdown div p').on('click', function() {
  const $type = $(this).text().split(' ')[0].toLowerCase();
  $('.dropdown header p').text($(this).text());
  $(this).parent().hide();
  applyFilter($type);
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

$('.inputs button').on('click', function(event) {
  const $vals = $(this).siblings('input');
  const type = $(this).data('type');
  let results = [];
  $vals.each(function() {
    results = [...results, /\d/g.test($(this).val())];
  });
  if (!results.includes(false)) {
    switchFetch(type, $vals);
    showSuccess(this);
  } else {
    showError(this);
  }
  $(this).parent().trigger("reset");
});

$('body').mouseup(function (event){
  const elements = [...$('.icons container'), ...$('.dropdown div')];
  elements.forEach(el => {
    if (!$(el).is(event.target) && $(el).has(event.target).length === 0) {
      $(el).hide();
    }
  });
});

$('.last').on('blur', function() {
  $('.icons container').hide();
});

$('.end').on('blur', function() {
  $('.dropdown div').hide();
});

function applyFilter(type) {
  $(`.main container`).hide();
  $(`.main container.${type}`).show();
}

function showSuccess(target) {
  $(target).siblings('.error').show();
  $(target).siblings('.error').text('Info has been sent');
  $(target).siblings('.error').css('color', 'green');
  setTimeout(function() {
    $('.error').hide();
    $('input').css({'border': '1px solid black', 'box-shadow': 'none'});
  }, 2000);
}

function showError(target) {
  $(target).siblings('.error').show();
  $(target).siblings('.error').text('Please, enter valid data');
  $(target).siblings('.error').css('color', 'red')
  $(target).siblings('input').css({'border': '1px solid red', 'box-shadow': '0 0 2px 0 red'});
  setTimeout(function() {
    $('.error').hide();
    $('input').css({'border': '1px solid black', 'box-shadow': 'none'});
  }, 2000);
}

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
