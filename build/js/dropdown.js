$(function(){
  /*
   * For the sake keeping the code clean and the examples simple this file
   * contains only the plugin configuration & callbacks.
   * 
   * UI functions ui_* can be located in:
   *   - assets/demo/uploader/js/ui-main.js
   *   - assets/demo/uploader/js/ui-multiple.js
   *   - assets/demo/uploader/js/ui-single.js
   */
  $('.zone').dmUploader({ 
    maxFileSize: 1000000, // 3 Megs max
    multiple: false,
    allowedTypes: 'image/*',
    extFilter: ['jpg','jpeg','png','gif'],
    onDragEnter: function(){
      // Happens when dragging something over the DnD area
      console.log("drag enter");
    },
    onDragLeave: function(){
      // Happens when dragging something OUT of the DnD area
      console.log("drag leave");
    },
    onInit: function(){
      // Plugin is ready to use
      console.log("drag init");
    },
    onComplete: function(){
      // All files in the queue are processed (success or error)
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
    onUploadProgress: function(id, percent){
      // Updating file progress
      // ui_single_update_progress(this, percent);
      console.log("upload in progress....");
      loadSearchPage();
    },
    onUploadSuccess: function(id, data){
      var response = JSON.stringify(data);

      // A file was successfully uploaded
      console.log("successfully uploaded...");

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
    onFileSizeError: function(file){
      console.log(this, 'File excess the size limit', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: size excess limit');
    },
    onFileTypeError: function(file){
      // ui_single_update_status(this, 'File type is not an image', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: must be an image (type error)');
    },
    onFileExtError: function(file){
      // ui_single_update_status(this, 'File extension not allowed', 'danger');

      console.log('File \'' + file.name + '\' cannot be added: must be an image (extension error)');
    }
  });
});