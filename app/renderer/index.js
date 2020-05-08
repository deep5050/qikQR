const ipcRenderer = require('electron').ipcRenderer;
const Store = require('electron-store');

const rimraf = require("rimraf");

var shell = require('electron').shell;
var $ = require('jquery');
var fs = require('fs');
var app = require('electron').remote.app;
var os = require("os");
var request = require('request');
const url = require('url');
var path = require('path');
var browserWindow = require('electron').remote.BrowserWindow;
//const logger = require('electron-timber');

const store = new Store();
var parameters = readSettings();
var saveLocation = process.env.HOME || process.env.USERPROFILE;

if (!fs.existsSync(path.join(saveLocation, 'qikqr'))) {
  fs.mkdirSync((path.join(saveLocation, 'qikqr')));
}

/* 
var saveLocation = os.homedir + '\\';
if(os.platform ==="linux") saveLocation = os.homedir + '\\'; */

saveLocation = (path.join(saveLocation, 'qikqr'));
var settingsWindowVisible = 0;
var tempdir = '';
var lastFilePath;

fs.mkdtemp(path.join(os.tmpdir(), 'qikqr'), (err, folder) => {
  if (err) throw err;
  console.log(folder);
  tempdir = folder;
});


function makelog(mssg, id = "logger") {
  if (id === "warn")
    id = "logger-warn";
  if (id === "error")
    id = "logger-error";
  ipcRenderer.send(id, mssg);
}

function readSettings() {
  var temp = {};
  temp.data = store.get('data', "");
  temp.size = store.get('size', '300');
  temp.ecc = store.get('ecc', 'L');
  temp.color = store.get('color', 'ff0');
  temp.bgcolor = store.get('bgcolor', '00f');
  temp.format = store.get('format', 'jpg');
  ipcRenderer.send("logger", "index: config-updated");
  return temp;
}

makelog(saveLocation);
$(document).ready(function () {
  $('body').transition('scale');
  $('#qr-text-input').focus();
  $('.special.cards .image').dimmer({
    on: 'hover'
  });

  $('#result-qr').hide();
  $("#attention").hide();
  $('#loading-gif').hide();
});

$('#close-button').on('click', e => {

  rimraf.sync(tempdir);
  app.quit();
});


$('#save-img').on('click', function () {
  var fname = parameters.data + "." + parameters.format;
  var outputLocation = path.join(saveLocation, fname);
  fs.createReadStream(lastFilePath).pipe(fs.createWriteStream(outputLocation)).on('finish', function () {
    shell.showItemInFolder(outputLocation);
  });

  /*   fs.createReadStream('output.' + parameters.format).pipe(fs.createWriteStream(outputLocation)).on('finish', function () {
      shell.showItemInFolder(outputLocation);
    }); */
});

$("#qr-text-input").keyup(function (event) {
  // If button pressed was ENTER
  if (event.keyCode === 13) {
    var qrTextInput = $('#qr-text-input').val();
    textToQR(qrTextInput);
  }
});

let settingsWindow;

function createSettingsWindow() {
  settingsWindow = new browserWindow({
    title: "settings",
    width: 340,
    height: 352,
    resizable: false,
    frame: false,
    maximizable: false,
    fullscreenable: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'view', 'settings.html'),
    protocol: 'file:',
    slashes: true
  }));

  settingsWindowVisible = 1;
}


$("#settings-button-id").on('click', function () {
  if (settingsWindowVisible === 0) {
    createSettingsWindow();
  } else
    try {
      settingsWindow.show();
    } catch (error) {
      createSettingsWindow();
    }
});




$('#home-button').on('click', function () {
  $('.main-window').css("background-color", "#330055");
  $(".main-window").css("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 1000'%3E%3Cg fill-opacity='0.39'%3E%3Ccircle fill='%23330055' cx='50' cy='0' r='50'/%3E%3Cg fill='%233a015d' %3E%3Ccircle cx='0' cy='50' r='50'/%3E%3Ccircle cx='100' cy='50' r='50'/%3E%3C/g%3E%3Ccircle fill='%23410165' cx='50' cy='100' r='50'/%3E%3Cg fill='%2348026e' %3E%3Ccircle cx='0' cy='150' r='50'/%3E%3Ccircle cx='100' cy='150' r='50'/%3E%3C/g%3E%3Ccircle fill='%23500376' cx='50' cy='200' r='50'/%3E%3Cg fill='%2357047e' %3E%3Ccircle cx='0' cy='250' r='50'/%3E%3Ccircle cx='100' cy='250' r='50'/%3E%3C/g%3E%3Ccircle fill='%235f0587' cx='50' cy='300' r='50'/%3E%3Cg fill='%2367068f' %3E%3Ccircle cx='0' cy='350' r='50'/%3E%3Ccircle cx='100' cy='350' r='50'/%3E%3C/g%3E%3Ccircle fill='%236f0798' cx='50' cy='400' r='50'/%3E%3Cg fill='%237707a0' %3E%3Ccircle cx='0' cy='450' r='50'/%3E%3Ccircle cx='100' cy='450' r='50'/%3E%3C/g%3E%3Ccircle fill='%238008a9' cx='50' cy='500' r='50'/%3E%3Cg fill='%238909b1' %3E%3Ccircle cx='0' cy='550' r='50'/%3E%3Ccircle cx='100' cy='550' r='50'/%3E%3C/g%3E%3Ccircle fill='%239109ba' cx='50' cy='600' r='50'/%3E%3Cg fill='%239a09c3' %3E%3Ccircle cx='0' cy='650' r='50'/%3E%3Ccircle cx='100' cy='650' r='50'/%3E%3C/g%3E%3Ccircle fill='%23a309cb' cx='50' cy='700' r='50'/%3E%3Cg fill='%23ad09d4' %3E%3Ccircle cx='0' cy='750' r='50'/%3E%3Ccircle cx='100' cy='750' r='50'/%3E%3C/g%3E%3Ccircle fill='%23b608dc' cx='50' cy='800' r='50'/%3E%3Cg fill='%23c007e5' %3E%3Ccircle cx='0' cy='850' r='50'/%3E%3Ccircle cx='100' cy='850' r='50'/%3E%3C/g%3E%3Ccircle fill='%23c905ee' cx='50' cy='900' r='50'/%3E%3Cg fill='%23d303f6' %3E%3Ccircle cx='0' cy='950' r='50'/%3E%3Ccircle cx='100' cy='950' r='50'/%3E%3C/g%3E%3Ccircle fill='%23D0F' cx='50' cy='1000' r='50'/%3E%3C/g%3E%3C/svg%3E")`);
  $(".main-window").css("background-repeate", "repeat");
  $(".main-window").css("background-attachment", "fixed");
  $(".main-window").css("background-size", "contain");
  $('.zone').show();
  $('#qr-output').remove();
  $('#result-qr').hide();
  $('#loading-gif').hide();
  $('#qr-text-input').val('');
  $('#fail-to-find-text-id').hide();
  $('#attention').hide();
  $('#qr-text-input').focus();
});

var file;
// read at least once
ipcRenderer.send("logger", "index: read for the first time");
readSettings();

ipcRenderer.on("update config", (event, message) => {
  //logger.warn(message);
});

ipcRenderer.on("update-config", (event, message) => {
  parameters = readSettings();
  ipcRenderer.send("logger", "index: i will update now");
});

function textToQR(txt) {
  loadSearchPage();
  if (txt === '' || txt == null) return;

  parameters.data = txt;
  ipcRenderer.send("logger", "index:" + parameters.data);
  //makelog(parameters.data);
  var reqURL = "https://api.qrserver.com/v1/create-qr-code/?" + "data=" + parameters.data + "&size=" + parameters.size + "x" + parameters.size + "&ecc=" + parameters.ecc + "&color=" + parameters.color + "&bgcolor=" + parameters.bgcolor + "&format=" + parameters.format;
  ipcRenderer.send("logger", "index:" + "URL" + reqURL);
  request(reqURL)
    .on('error', function (err) {
      ipcRenderer.send("logger-error", "index: error occured");
      showErrorPage();
    })
    .on('response', function (response) {
      if (response.statusCode === 200) {
        var tempfname = parameters.data + '.' + parameters.format;
        var temploc = path.join(tempdir, tempfname);
        lastFilePath = temploc;
        file = fs.createWriteStream(temploc, {
          autoClose: true
        });
        response.pipe(file);

        /*
                var tempname = 'output.'+parameters.format;
                file = fs.createWriteStream(path.join(__dirname,tempname), {
                  autoClose: true
                });
                response.pipe(file);
        */

        ipcRenderer.send("logger", "index: success and file created");
        showSuccessPage(txt, file);
      }
    })
}

function loadSearchPage() {
  $('.zone').hide();
  $('#result-qr').hide();
  $('#attention').hide();
  $('#loading-gif').show();
}

//Function to genereate a simple random token 
function tokenGenerator() {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function showSuccessPage(txt, file) {
  $('.zone').hide();
  $(".fail-to-find-text").text("");
  $(".main-window").css("background-repeate", "repeat");
  $(".main-window").css("background-attachment", "fixed");
  $(".main-window").css("background-size", "cover");


  $("#loading-id").hide();
  $('#loading-gif').hide();
  $("#logo").attr("src", "../img/logo-g.svg");
  $('#result-qr').show();
  file.on('finish', function () {
    $('#qr-output').remove();
    var qrOutput = document.createElement('img');
    /*  var fname_ = 'output.' + parameters.format + '?' + tokenGenerator();
     var src = path.join(__dirname, '..', '..', fname_) */
    qrOutput.src = lastFilePath + '?' + tokenGenerator();
    qrOutput.id = "qr-output";
    $('#logo-here').append(qrOutput);
    $('#attention').hide();
  });

}

function showErrorPage() {
  $('.main-window').css("background-color", "#000000");
  $(".main-window").css("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='30' viewBox='0 0 1000 120'%3E%3Cg fill='none' stroke='%23222' stroke-width='10' %3E%3Cpath d='M-500 75c0 0 125-30 250-30S0 75 0 75s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 45c0 0 125-30 250-30S0 45 0 45s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 105c0 0 125-30 250-30S0 105 0 105s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 15c0 0 125-30 250-30S0 15 0 15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500-15c0 0 125-30 250-30S0-15 0-15s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3Cpath d='M-500 135c0 0 125-30 250-30S0 135 0 135s125 30 250 30s250-30 250-30s125-30 250-30s250 30 250 30s125 30 250 30s250-30 250-30'/%3E%3C/g%3E%3C/svg%3E")`);
  $(".main-window").css("background-repeate", "repeat");
  $(".main-window").css("background-attachment", "fixed");
  $(".main-window").css("background-size", "contain");

  $('.zone').hide();
  $(".fail-to-find-text").text("Please check your internet connection before retrying.");
  $(".fail-to-find-text").fadeIn("fast");
  $("#attention").show();
  $('#fail-to-find-text-id').show();
  $('#loading-gif').hide();
}

function handleDragEvents(type, mssg) {
  $('.zone').show();
  $(".fail-to-find-text").text(mssg);
  $(".fail-to-find-text").fadeIn("fast");
  $('#fail-to-find-text-id').show();

  if (type === 'error') {
    $('.zone').transition('shake');
    $(".fail-to-find-text").css('color', 'red');
  }
  else {
    $(".fail-to-find-text").css('color', 'white');
  }
}

module.exports.makelog = makelog;
