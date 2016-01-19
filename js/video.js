(function localFileVideoPlayerInit(win) {
    $('#file-selected').val('');
    var URL = win.URL || win.webkitURL;

    var playSelectedFile = function playSelectedFileInit(event) {
        var file = this.files[0];
        var type = file.type;
        var videoNode = document.querySelector('video');
        var fileURL = URL.createObjectURL(file);
        videoNode.src = fileURL;
        $('#file-selected').val(file.name);
    };

    var inputNode = document.getElementById('file');
    inputNode.addEventListener('change', playSelectedFile, false);
}(window));

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
});