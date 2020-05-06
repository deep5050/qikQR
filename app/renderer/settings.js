//FIXME const { writeSettings } = require("./writeSettings.js");

const remote = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
var shell = require('electron').shell;
var $ = require('jquery');
var fs = require('fs');
var app = require('electron').remote.app;
var maxSize = 1000;




var defaultParameters = {
  data: "",
  size: "300",
  ecc: "L",
  color: "000",
  bgcolor: "fff",
  format: "jpg"
};
//exports.defaultParameters = defaultParameters;

var parameters = {
  data: "",
  size: "300",
  ecc: "L",
  color: "000",
  bgcolor: "fff",
  format: "jpg"
};




function writeSettings(obj) {
  ipcRenderer.send("logger","settngs: writing");
    var sizeInput = $('#size').val();
    if (sizeInput != "" || sizeInput != null || sizeInput <= maxSize) {
      if (sizeInput < 100) {
        parameters.size = defaultParameters.size;
        console.log("rounded");
      }
      else {
        parameters.size = sizeInput;
        console.log("ok");
      }
    }
    else
      parameters.size = defaultParameters.size;
    if (obj.size > maxSize)
      obj.size = maxSize;
    var dataToWrite = JSON.stringify(obj);
    fs.writeFileSync('./settings.json', dataToWrite);
    console.log("saved.." + dataToWrite);
    return;
  }

$(document).ready(function () {
  $('#close-button').on('click', e => {
    remote.getCurrentWindow().close();
  });
  $('#format').dropdown();
  $('#color').dropdown();
  $('#bgcolor').dropdown();
  $('#ecc').dropdown();


  ////////////// FORMAT ////////////

  $('#format-jpg').on('click', function () {
    parameters.format = "jpg";
    maxSize = 1000;
    $('#size').attr('placeholder', 'max-size  ' + maxSize);
  })
  $('#format-jpeg').on('click', function () {
    parameters.format = "jpeg";
    maxSize = 1000;
    $('#size').attr('placeholder', 'max-size  ' + maxSize);
  })
  $('#format-png').on('click', function () {
    parameters.format = "png";
    maxSize = 1000;
    $('#size').attr('placeholder', 'max-size  ' + maxSize);
  })
  $('#format-gif').on('click', function () {
    parameters.format = "gif";
    maxSize = 1000;
    $('#size').attr('placeholder', 'max-size  ' + maxSize);
  })
  $('#format-svg').on('click', function () {
    parameters.format = "svg";
    maxSize = 1000000;
    $('#size').attr('placeholder', 'max-size  ' + maxSize);
  })
  /////////////////////// ECC /////////////////

  $('#ecc-h').on('click', function () {
    parameters.ecc = "H";
  })
  $('#ecc-m').on('click', function () {
    parameters.ecc = "M";
  })
  $('#ecc-l').on('click', function () {
    parameters.ecc = "L";
  })
  $('#ecc-q').on('click', function () {
    parameters.ecc = "Q";
  })

  //////////////////// COLOR ///////////////

  $('#color-red').on('click', function () {
    parameters.color = "f00";
  })

  $('#color-yellow').on('click', function () {
    parameters.color = "ff0"; 
  })
  $('#color-white').on('click', function () {
    parameters.color = "fff";
  })
  $('#color-black').on('click', function () {
    parameters.color = "000";
  })
  $('#color-blue').on('click', function () {
    parameters.color = "00f";
  })

  ////////////////// BGCOLOR ///////////////
  $('#bgcolor-blue').on('click', function () {
    parameters.bgcolor = "00f";
  })
  $('#bgcolor-red').on('click', function () {
    parameters.bgcolor = "f00";
  })
  $('#bgcolor-white').on('click', function () {
    parameters.bgcolor = "fff";
  })
  $('#bgcolor-black').on('click', function () {
    parameters.bgcolor = "000";
  })
  $('#bgcolor-yellow').on('click', function () {
    parameters.bgcolor = "ff0"; 
  })

  ///////////////// SIZE /////////////////

  $("#size").keydown(function (e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
      // Allow: Ctrl+A, Command+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, down, up
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });




  $("#size").keyup(function (event) {
    // If button pressed was ENTER
   
    if (event.keyCode === 13) {
      var sizeInput = $('#size').val();
      if (sizeInput != "" || sizeInput != null || sizeInput <= maxSize) {
        if (sizeInput < 100) {
          parameters.size = defaultParameters.size;
          console.log("rounded");
        } else {
          parameters.size = sizeInput;
          //console.log("ok");
        }
      } else parameters.size = defaultParameters.size;
    }
  });

  $('#default').on('click', function () {
    parameters = defaultParameters;
    writeSettings(defaultParameters);
      setTimeout(function() {
        ipcRenderer.send("logger","settings: save button clicked");
    ipcRenderer.send("logger","settings: config updated");
}, 1000);
  });


  $('#bug').on('click',function (){
    shell.openExternal("https://github.com/deep5050/qikQR/issues");
  })
  $('#heart').on('click',function (){
    shell.openExternal("https://www.paypal.me/deep5050");
  })
  $('#save').on('click', function () {
  
    
    writeSettings(parameters);

    // wait for some time to write the file
    setTimeout(function() {
      ipcRenderer.send("logger","settings: save button clicked");
    ipcRenderer.send("logger","settings: config updated");
}, 1000);
  });
});


