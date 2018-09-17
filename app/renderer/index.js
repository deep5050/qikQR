const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
var shell = require('electron').shell;
var $ = require('jquery');
var fs = require('fs');
var app = require('electron').remote.app;
var os = require("os");
var request = require('request');
const url = require('url');
var path = require('path');
var broserWindow = require('electron').remote.BrowserWindow;
var parameters;
var saveLocation = os.homedir + '\\';
var settingsWindowVisible = 0;
console.log(saveLocation);
$(document).ready(function () {
  $('body').transition('scale');
  $('#qr-text-input').focus();
  // $('body').on('keyup', function ()
  // {
  //   $('#qr-text-input').focus();
  //   console.log('*');
  // })
  $('.special.cards .image').dimmer({
    on: 'hover'
  });
  $('#result-qr').hide();

  $("#attention").hide();
  $('#loading-gif').hide();


  $('.zone').dmUploader({ 
    maxFileSize: 1000000, //1mb
    multiple: false,
    allowedTypes: 'image/*',
    extFilter: ['jpg','jpeg','png','gif'],
    onDragEnter: function () {
      $('#loading-id').show();
      $('#drag-caption-id').hide();
      $('.zone').css('border-radius', '50%');

      // Happens when dragging something over the DnD area
      handleDragEvents('info',"Release to upload");
      console.log("drag enter");
      
    },
    onDragLeave: function () {
      $('#loading-id').hide();
      $('#drag-caption-id').show();

      $('.zone').css('border-radius', '0%');
      handleDragEvents('info',"");
      console.log("drag leave");
    },
    onInit: function(){
      // Plugin is ready to use
      console.log("drag init");
    },
    onComplete: function(){
      // All files in the queue are processed (success or error)
      handleDragEvents('info',"");
      console.log("finish");
    },
    onNewFile: function(id, file){
      // When a new file is added using the file selector or the DnD area
 
      console.log("new "+id);

      if (typeof FileReader !== "undefined"){
        var reader = new FileReader();
        var img = this.find('img');
        
        reader.onload = function (e) {
          img.attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
      }
    },
    onBeforeUpload: function(id){
      // about tho start uploading a file
      console.log("starting upload....");
      // ui_single_update_progress(this, 0, true);      
      // ui_single_update_active(this, true);

      // ui_single_update_status(this, 'Uploading...');
    },
    onUploadProgress: function (id, percent) {
      handleDragEvents('info',"Uploading the file .."+percent+"%");
      // Updating file progress
      // ui_single_update_progress(this, percent);
      console.log("upload in progress....");
     // loadSearchPage();
    },
    onUploadSuccess: function(id, data){
      var response = JSON.stringify(data);
      handleDragEvents('info',"Successfully uploaded");

      // A file was successfully uploaded
      console.log("successfully uploaded...");
     // showSuccessPage();

      // ui_single_update_active(this, false);

      // // You should probably do something with the response data, we just show it
      // this.find('input[type="text"]').val(response);

      // ui_single_update_status(this, 'Upload completed.', 'success');
    },
    onUploadError: function(id, xhr, status, message){
      // Happens when an upload error happens
      console.log(this, false);
      // ui_single_update_status(this, 'Error: ' + message, 'danger');
    },
    onFallbackMode: function(){
      // When the browser doesn't support this plugin :(
      console.log('Plugin cant be used here, running Fallback callback');
    },
    onFileSizeError: function (file) {
      handleDragEvents('error',"File size exceeds 1MB");
      console.log(this, 'File excess the size limit', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: size excess limit');
    },
    onFileTypeError: function (file) {
      handleDragEvents('error',file.name+" is not an image");
      // ui_single_update_status(this, 'File type is not an image', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: must be an image (type error)');
    },
    onFileExtError: function (file) {
      handleDragEvents('error',file.name+" is not an image");
      // ui_single_update_status(this, 'File extension not allowed', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: must be an image (extension error)');
     // showErrorPage();
    }
  });


});

$('#close-button').on('click', e => {
  app.quit();
});
var lastFileName;

$('#save-img').on('click', function () {
  // var outpotLocation = saveLocation + lastFileName + "."+parameters.format;
  var outputLocation = saveLocation + parameters.data + "." + parameters.format;
  fs.createReadStream('output.' + parameters.format).pipe(fs.createWriteStream(outputLocation)).on('finish', function () {
    shell.showItemInFolder(outputLocation);
  });
});

$("#qr-text-input").keyup(function (event) {
  // If button pressed was ENTER
  console.log("entered");
  if (event.keyCode === 13) {
    var qrTextInput = $('#qr-text-input').val();
    textToQR(qrTextInput);
  }
});

let settingsWindow;


function createSettingsWindow()
{
  settingsWindow = new broserWindow({
    title: "settings",
    width: 340,
    height: 352,
    resizable: true,
    frame: false,
    maximizable: true,
    fullscreenable: false
  });
  settingsWindow.loadURL(url.format({
    pathname: path.join(__dirname, '..', 'view', 'settings.html'),
    protocol: 'file:',
    slashes: true
  }));
  settingsWindowVisible = 1;
}
$("#settings-button-id").on('click', function () {
  if (settingsWindowVisible == 0) {
    createSettingsWindow();
  } else
    try {
      settingsWindow.show();
    } catch (error) {
      createSettingsWindow();
    }
   

 // settingsWindow.webContents.openDevTools();

})

function readSettings() {
  parameters = JSON.parse(fs.readFileSync('./settings.json'));
  return;
}


$('#home-button').on('click', function () {
  // $(".main-window").css("background", "linear-gradient(rgb(245, 31, 152) 0%, rgb(25, 20, 24) 85%, rgb(25, 86, 243) 100%)");

  $('.main-window').css("background-color", "#330055");
  $('.zone').dmUploader('reset');

  // $('.main-window').css("background-image", ` url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2000' height='2000' viewBox='0 0 800 800'%3E%3Cg fill='none' %3E%3Cg stroke='%23026' stroke-width='17'%3E%3Cline x1='-8' y1='-8' x2='808' y2='808'/%3E%3Cline x1='-8' y1='792' x2='808' y2='1608'/%3E%3Cline x1='-8' y1='-808' x2='808' y2='8'/%3E%3C/g%3E%3Cg stroke='%23002163' stroke-width='16'%3E%3Cline x1='-8' y1='767' x2='808' y2='1583'/%3E%3Cline x1='-8' y1='17' x2='808' y2='833'/%3E%3Cline x1='-8' y1='-33' x2='808' y2='783'/%3E%3Cline x1='-8' y1='-783' x2='808' y2='33'/%3E%3C/g%3E%3Cg stroke='%23002060' stroke-width='15'%3E%3Cline x1='-8' y1='742' x2='808' y2='1558'/%3E%3Cline x1='-8' y1='42' x2='808' y2='858'/%3E%3Cline x1='-8' y1='-58' x2='808' y2='758'/%3E%3Cline x1='-8' y1='-758' x2='808' y2='58'/%3E%3C/g%3E%3Cg stroke='%23001f5c' stroke-width='14'%3E%3Cline x1='-8' y1='67' x2='808' y2='883'/%3E%3Cline x1='-8' y1='717' x2='808' y2='1533'/%3E%3Cline x1='-8' y1='-733' x2='808' y2='83'/%3E%3Cline x1='-8' y1='-83' x2='808' y2='733'/%3E%3C/g%3E%3Cg stroke='%23001e59' stroke-width='13'%3E%3Cline x1='-8' y1='92' x2='808' y2='908'/%3E%3Cline x1='-8' y1='692' x2='808' y2='1508'/%3E%3Cline x1='-8' y1='-108' x2='808' y2='708'/%3E%3Cline x1='-8' y1='-708' x2='808' y2='108'/%3E%3C/g%3E%3Cg stroke='%23001d56' stroke-width='12'%3E%3Cline x1='-8' y1='667' x2='808' y2='1483'/%3E%3Cline x1='-8' y1='117' x2='808' y2='933'/%3E%3Cline x1='-8' y1='-133' x2='808' y2='683'/%3E%3Cline x1='-8' y1='-683' x2='808' y2='133'/%3E%3C/g%3E%3Cg stroke='%23001c53' stroke-width='11'%3E%3Cline x1='-8' y1='642' x2='808' y2='1458'/%3E%3Cline x1='-8' y1='142' x2='808' y2='958'/%3E%3Cline x1='-8' y1='-158' x2='808' y2='658'/%3E%3Cline x1='-8' y1='-658' x2='808' y2='158'/%3E%3C/g%3E%3Cg stroke='%23001b4f' stroke-width='10'%3E%3Cline x1='-8' y1='167' x2='808' y2='983'/%3E%3Cline x1='-8' y1='617' x2='808' y2='1433'/%3E%3Cline x1='-8' y1='-633' x2='808' y2='183'/%3E%3Cline x1='-8' y1='-183' x2='808' y2='633'/%3E%3C/g%3E%3Cg stroke='%23001a4c' stroke-width='9'%3E%3Cline x1='-8' y1='592' x2='808' y2='1408'/%3E%3Cline x1='-8' y1='192' x2='808' y2='1008'/%3E%3Cline x1='-8' y1='-608' x2='808' y2='208'/%3E%3Cline x1='-8' y1='-208' x2='808' y2='608'/%3E%3C/g%3E%3Cg stroke='%23001949' stroke-width='8'%3E%3Cline x1='-8' y1='567' x2='808' y2='1383'/%3E%3Cline x1='-8' y1='217' x2='808' y2='1033'/%3E%3Cline x1='-8' y1='-233' x2='808' y2='583'/%3E%3Cline x1='-8' y1='-583' x2='808' y2='233'/%3E%3C/g%3E%3Cg stroke='%23001846' stroke-width='7'%3E%3Cline x1='-8' y1='242' x2='808' y2='1058'/%3E%3Cline x1='-8' y1='542' x2='808' y2='1358'/%3E%3Cline x1='-8' y1='-558' x2='808' y2='258'/%3E%3Cline x1='-8' y1='-258' x2='808' y2='558'/%3E%3C/g%3E%3Cg stroke='%23001743' stroke-width='6'%3E%3Cline x1='-8' y1='267' x2='808' y2='1083'/%3E%3Cline x1='-8' y1='517' x2='808' y2='1333'/%3E%3Cline x1='-8' y1='-533' x2='808' y2='283'/%3E%3Cline x1='-8' y1='-283' x2='808' y2='533'/%3E%3C/g%3E%3Cg stroke='%2300163f' stroke-width='5'%3E%3Cline x1='-8' y1='292' x2='808' y2='1108'/%3E%3Cline x1='-8' y1='492' x2='808' y2='1308'/%3E%3Cline x1='-8' y1='-308' x2='808' y2='508'/%3E%3Cline x1='-8' y1='-508' x2='808' y2='308'/%3E%3C/g%3E%3Cg stroke='%2300153c' stroke-width='4'%3E%3Cline x1='-8' y1='467' x2='808' y2='1283'/%3E%3Cline x1='-8' y1='317' x2='808' y2='1133'/%3E%3Cline x1='-8' y1='-333' x2='808' y2='483'/%3E%3Cline x1='-8' y1='-483' x2='808' y2='333'/%3E%3C/g%3E%3Cg stroke='%23001439' stroke-width='3'%3E%3Cline x1='-8' y1='342' x2='808' y2='1158'/%3E%3Cline x1='-8' y1='442' x2='808' y2='1258'/%3E%3Cline x1='-8' y1='-458' x2='808' y2='358'/%3E%3Cline x1='-8' y1='-358' x2='808' y2='458'/%3E%3C/g%3E%3Cg stroke='%23001336' stroke-width='2'%3E%3Cline x1='-8' y1='367' x2='808' y2='1183'/%3E%3Cline x1='-8' y1='417' x2='808' y2='1233'/%3E%3Cline x1='-8' y1='-433' x2='808' y2='383'/%3E%3Cline x1='-8' y1='-383' x2='808' y2='433'/%3E%3C/g%3E%3Cg stroke='%23013' stroke-width='1'%3E%3Cline x1='-8' y1='392' x2='808' y2='1208'/%3E%3Cline x1='-8' y1='-408' x2='808' y2='408'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`);




  $(".main-window").css("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 1000'%3E%3Cg fill-opacity='0.39'%3E%3Ccircle fill='%23330055' cx='50' cy='0' r='50'/%3E%3Cg fill='%233a015d' %3E%3Ccircle cx='0' cy='50' r='50'/%3E%3Ccircle cx='100' cy='50' r='50'/%3E%3C/g%3E%3Ccircle fill='%23410165' cx='50' cy='100' r='50'/%3E%3Cg fill='%2348026e' %3E%3Ccircle cx='0' cy='150' r='50'/%3E%3Ccircle cx='100' cy='150' r='50'/%3E%3C/g%3E%3Ccircle fill='%23500376' cx='50' cy='200' r='50'/%3E%3Cg fill='%2357047e' %3E%3Ccircle cx='0' cy='250' r='50'/%3E%3Ccircle cx='100' cy='250' r='50'/%3E%3C/g%3E%3Ccircle fill='%235f0587' cx='50' cy='300' r='50'/%3E%3Cg fill='%2367068f' %3E%3Ccircle cx='0' cy='350' r='50'/%3E%3Ccircle cx='100' cy='350' r='50'/%3E%3C/g%3E%3Ccircle fill='%236f0798' cx='50' cy='400' r='50'/%3E%3Cg fill='%237707a0' %3E%3Ccircle cx='0' cy='450' r='50'/%3E%3Ccircle cx='100' cy='450' r='50'/%3E%3C/g%3E%3Ccircle fill='%238008a9' cx='50' cy='500' r='50'/%3E%3Cg fill='%238909b1' %3E%3Ccircle cx='0' cy='550' r='50'/%3E%3Ccircle cx='100' cy='550' r='50'/%3E%3C/g%3E%3Ccircle fill='%239109ba' cx='50' cy='600' r='50'/%3E%3Cg fill='%239a09c3' %3E%3Ccircle cx='0' cy='650' r='50'/%3E%3Ccircle cx='100' cy='650' r='50'/%3E%3C/g%3E%3Ccircle fill='%23a309cb' cx='50' cy='700' r='50'/%3E%3Cg fill='%23ad09d4' %3E%3Ccircle cx='0' cy='750' r='50'/%3E%3Ccircle cx='100' cy='750' r='50'/%3E%3C/g%3E%3Ccircle fill='%23b608dc' cx='50' cy='800' r='50'/%3E%3Cg fill='%23c007e5' %3E%3Ccircle cx='0' cy='850' r='50'/%3E%3Ccircle cx='100' cy='850' r='50'/%3E%3C/g%3E%3Ccircle fill='%23c905ee' cx='50' cy='900' r='50'/%3E%3Cg fill='%23d303f6' %3E%3Ccircle cx='0' cy='950' r='50'/%3E%3Ccircle cx='100' cy='950' r='50'/%3E%3C/g%3E%3Ccircle fill='%23D0F' cx='50' cy='1000' r='50'/%3E%3C/g%3E%3C/svg%3E")`);
  $(".main-window").css("background-repeate", "repeat");
  $(".main-window").css("background-attachment", "fixed");
  $(".main-window").css("background-size", "contain");
  // $(".main-window").css("background-size","cover");
  console.log("home button clicked");
  $('.zone').show();
  $('#qr-output').remove();
  $('#result-qr').hide();
  //   $(".main-window").css("background", "linear-gradient(rgb(149, 230, 70) 0%, rgb(29, 179, 54) 52%, rgb(0, 0, 0) 100%)");
  // });
  $('#loading-gif').hide();
  $('#qr-text-input').val('');
  $('#fail-to-find-text-id').hide();
  $('#attention').hide();
  $('#qr-text-input').focus();

});
var file;

function textToQR(txt) {
  loadSearchPage();
  if (txt == '' || txt == null) return;
  readSettings();
  parameters.data = txt;
  console.log(parameters.data);
  var reqURL = "https://api.qrserver.com/v1/create-qr-code/?" + "data=" + parameters.data + "&size=" + parameters.size + "x" + parameters.size + "&ecc=" + parameters.ecc + "&color=" + parameters.color + "&bgcolor=" + parameters.bgcolor + "&format=" + parameters.format;
  console.log(reqURL);
  request(reqURL)
    .on('error', function (err) {
      showErrorPage();
    })
    .on('response', function (response) {
      if (response.statusCode == 200) {
        file = fs.createWriteStream('output.' + parameters.format, {
          autoClose: true
        });
        response.pipe(file);
        showSuccessPage(txt, file);
      }
    })
}

function loadSearchPage() {
  $('#result-qr').hide();
  $('#attention').hide();
  $('.zone').hide();
  $('#loading-gif').show();
}

//Function to genereate a simple random token 
// (token is used to determine which page user is viewing in gSubs)
function tokenGenerator() {
  var text = "";
  var possible = "0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function showSuccessPage(txt, file) {
  //$(".main-window").css("background", "linear-gradient(to bottom,  #ADD372 0%, #8EC89F 85%,#77C0C0 100%)");
  $('.main-window').css("background-color", "#91ffa9");
  $(".main-window").css("background-image", `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='50' height='25' viewBox='0 0 50 25'%3E%3Cdefs%3E%3Crect stroke='%2388ff81' stroke-width='0.1' width='1' height='1' id='s'/%3E%3Cpattern id='a' width='2' height='2' patternUnits='userSpaceOnUse'%3E%3Cg stroke='%2388ff81' stroke-width='0.1'%3E%3Crect fill='%2385fa7e' width='1' height='1'/%3E%3Crect fill='%2388ff81' width='1' height='1' x='1' y='1'/%3E%3Crect fill='%2383f57c' width='1' height='1' y='1'/%3E%3Crect fill='%2380f079' width='1' height='1' x='1'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='b' width='5' height='11' patternUnits='userSpaceOnUse'%3E%3Cg fill='%237deb77'%3E%3Cuse xlink:href='%23s' x='2' y='0'/%3E%3Cuse xlink:href='%23s' x='4' y='1'/%3E%3Cuse xlink:href='%23s' x='1' y='2'/%3E%3Cuse xlink:href='%23s' x='2' y='4'/%3E%3Cuse xlink:href='%23s' x='4' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='8'/%3E%3Cuse xlink:href='%23s' x='3' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='c' width='7' height='7' patternUnits='userSpaceOnUse'%3E%3Cg fill='%237ae574'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='3' y='4'/%3E%3Cuse xlink:href='%23s' x='5' y='6'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='d' width='11' height='5' patternUnits='userSpaceOnUse'%3E%3Cg fill='%2388ff81'%3E%3Cuse xlink:href='%23s' x='1' y='1'/%3E%3Cuse xlink:href='%23s' x='6' y='3'/%3E%3Cuse xlink:href='%23s' x='8' y='2'/%3E%3Cuse xlink:href='%23s' x='3' y='0'/%3E%3Cuse xlink:href='%23s' x='0' y='3'/%3E%3C/g%3E%3Cg fill='%2378e072'%3E%3Cuse xlink:href='%23s' x='8' y='3'/%3E%3Cuse xlink:href='%23s' x='4' y='2'/%3E%3Cuse xlink:href='%23s' x='5' y='4'/%3E%3Cuse xlink:href='%23s' x='10' y='0'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='e' width='47' height='23' patternUnits='userSpaceOnUse'%3E%3Cg fill='%232f2a1e'%3E%3Cuse xlink:href='%23s' x='2' y='5'/%3E%3Cuse xlink:href='%23s' x='23' y='13'/%3E%3Cuse xlink:href='%23s' x='4' y='18'/%3E%3Cuse xlink:href='%23s' x='35' y='9'/%3E%3C/g%3E%3C/pattern%3E%3Cpattern id='f' width='61' height='31' patternUnits='userSpaceOnUse'%3E%3Cg fill='%232f2a1e'%3E%3Cuse xlink:href='%23s' x='16' y='0'/%3E%3Cuse xlink:href='%23s' x='13' y='22'/%3E%3Cuse xlink:href='%23s' x='44' y='15'/%3E%3Cuse xlink:href='%23s' x='12' y='11'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect fill='url(%23a)' width='50' height='25'/%3E%3Crect fill='url(%23b)' width='50' height='25'/%3E%3Crect fill='url(%23c)' width='50' height='25'/%3E%3Crect fill='url(%23d)' width='50' height='25'/%3E%3Crect fill='url(%23e)' width='50' height='25'/%3E%3Crect fill='url(%23f)' width='50' height='25'/%3E%3C/svg%3E")`);
  $(".main-window").css("background-repeate", "repeat");
  $(".main-window").css("background-attachment", "fixed");
  $(".main-window").css("background-size", "cover");

  // $("#searching-sub-for-id").text('your QR code is here');
  $('.zone').hide();
  $("#loading-id").hide();
  $('#loading-gif').hide();
  $("#logo").attr("src", "../img/logo-g.svg");
  $('#result-qr').show();
  file.on('finish', function () {
    $('#qr-output').remove();
    console.log("removed");
    var qrOutput = document.createElement('img');
    qrOutput.src = '../../output.'+parameters.format+'?' + tokenGenerator(); // to read different files with same name . ?randomnumber helps to force the browser to fetch the image file from directory instead of cache
    qrOutput.id = "qr-output";
    $('#logo-here').append(qrOutput);

    $('#attention').hide();
    console.log("created again");
  });

}

function showErrorPage() {

  //$(".main-window").css("background", "linear-gradient(to bottom,  #DD1818 0%, #862626 85%,#DD1818 100%)");

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
function handleDragEvents(type, mssg)
{
  $('.zone').show();
  $(".fail-to-find-text").text(mssg);

  $(".fail-to-find-text").fadeIn("fast");
  $('#fail-to-find-text-id').show();
  //$("#loading-id").show();
  //$("#loading-id").fadeOut("slow");
  if (type == 'error') {
    $('.zone').transition('shake');
    $(".fail-to-find-text").css('color', 'red');
  }
    else
    {
      $(".fail-to-find-text").css('color', 'white');
    
    }

  }
