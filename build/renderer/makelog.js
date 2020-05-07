//const { ipcRenderer } = require("./index");
const ipcRenderer = require('electron').ipcRenderer;
module.exports.makelog = function makelog(mssg, id = "logger") {
  if (id == "warn")
    id = "logger-warn";
  if (id == "error")
    id = "logger-error";
  ipcRenderer.send(id, mssg);
}