(function ($) {
    if (!$.borja) {
        $.borja = new Object();
    }

    $.borja.videoPlayer = function (el, getData, options) {
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        var randomID = function () {
            return Math.floor(Math.random() * (1000 - 1));
        };
        base.id = randomID();
        // Add a reverse reference to the DOM object
        base.$el.data("borja.videoPlayer", base);
        base.init = function () {
            base.getData = getData;
            base.options = $.extend({}, $.borja.videoPlayer.defaultOptions, options);
            base.render({
                videoUrl: base.options.url,
                labelNoSupport: base.options.labelNoSupport,
                videoWidth: base.options.videoWidth,
                videoName: base.options.videoName
            });
            base.addListeners();
        };
        // Sample Function, Uncomment to use
        base.render = function (data) {
            //Components architecture:
            //It will be used to dynamically create HTML code with String.format()
            var modal1 = "<div class='modal fade {0}' id='{1}' tabindex='-1' role='dialog' aria-labelledby='myModal'><div class= 'modal-dialog' role= 'document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button><h4 class='modal-title' id='myModalLabel'>{2}</h4></div><div class='modal-body {3}'> {4}</div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>Close</button><button type='button' class='btn btn-primary {5}'>{6}</button></div></div></div></div>";
            var progressBar = "<div class='{0}' style='{1}'><div class='progress-bar progress-bar-{2} {3}' role='progressbar' aria-valuenow='{4}' aria-valuemin='{5}' aria-valuemax='{6}' style='{7}'><span class='{8}'>{9}</span></div>";
            var button = "<button type='{0}' id='{3}' title='{4}' class='btn btn-primary box {1}' {5}><span class='glyphicon {2}' aria-hidden='true'></span></button>";
            var video = "<video id='{0}' class='{1}' width='{2}'><source id='{3}' src='{4}'> </video>"
            // variable to store generated HTML
            var code = "";

            //Objects:
            var videos = {
                video1: [base.id, 'video', data.videoWidth, 'source1', data.videoUrl, 'videoCont']
            }
            var buttons = {
                button1: ["text", "play", "glyphicon-play", ''],
                button2: ["text", "stop", "glyphicon-stop", ''],
                button3: ["text", "slowly", "glyphicon-fast-backward", ''],
                button4: ["text", "faster", "glyphicon-fast-forward", ''],
                button5: ["text", "lessVolume", "glyphicon-volume-down", ''],
                button6: ["text", "moreVolume", "glyphicon-volume-up", ''],
                button7: ["text", "noVolume", "glyphicon-volume-off", ''],
                button8: ["text", "loop", "glyphicon-repeat", ''],
                button9: ["text", "displayFrames", "glyphicon-cog", "data-toggle='modal' data-target='.modalStorage'"],
                button10: ["text", "fullScreen", "glyphicon-fullscreen", ''],
                button11: ["text", "save", "glyphicon-save", "data-toggle='modal' data-target='.modalAdd'"]
            };
            var progressBars = {
                bar1: ['progress', ('max-width:' + data.videoWidth + 'px; margin:0 auto;'), 'warning', 'time', '0', '0', '100', 'width:0%;', 'videoTime', 'video'],
                bar2: ['progress volume', ('max-width:' + data.videoWidth + 'px; margin:0 auto;'), 'default', 'vol', '0', '0', '100', 'width:50%;', '', ''],
                bar3: ['progress', ('max-width:' + data.videoWidth + 'px; margin:0 auto;'), 'default', 'sp', '0', '0', '100', 'width:50%;', 'speed', 'Speed X1.0']
            };
            var modals = {
                modalDelete: ['modalStorage', randomID(), 'Local Storage', 'modalFrames', "<div class='data'></div>", 'deleteLocalStorage', 'Delete Data!'],
                modalAdd: ['modalAdd', randomID(), 'Save Frame', '', "<form><div class='form-group'> <label for='name' class='control-label'>Frame's Name:</label> <input type='text' class='form-control' id='valueName' autofocus> </div> </form>", 'saveFrame', 'Save this Frame!', '']
            };

            //GENERATION:

            $.each(videos, function () {
                code += "<div class='container " + this[5] + " text-center' style='max-width:" + (this[2] + 100) + "px'>";
                code += "<div class='info'>" + data.videoName + "</div>";
                code += "<div class='row text-center'>";
                code += video.format(this[0], this[1], this[2], this[3], this[4]);
                code += "</div>";
                code += "<div class='buttons'>";
            });

            $.each(buttons, function (index) {
                code += button.format(this[0], this[1], this[2], randomID(), this[1], this[3]);
            });
            code += "</div>";
            $.each(progressBars, function () {
                code += "<div class='row'>";
                code += progressBar.format(this[0], this[1], this[2], this[3], this[4], this[5], this[6], this[7], this[8], this[9], this[10]);
                code += "</div>";
            });
            $.each(modals, function () {
                code += modal1.format(this[0], this[1], this[2], this[3], this[4], this[5], this[6]);
            });
            code += "</div>";
            base.$el.html(code);
        };

        //String format method.    var b = {0}{1}.format({1}{0}); --> {1}{0}
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
                return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
            });
        };

        base.addListeners = function () {
            // I will work easily with var video.
            var video = ($('#' + base.id).get(0));

            //It refreshes the bar of the current time of the Video.
            function refreshVideo() {
                var time = (100 / video.duration) * video.currentTime;
                $('.time').attr('aria-valuenow', time).css('width', time + '%');
                $('.videoTime').text(video.currentTime.toFixed(2) + "/" + video.duration);
            }

            //It calls the previous method every X time. (only if the video is not paused);
            window.setInterval(function () {
                if (!video.paused) {
                    refreshVideo();
                }
            }, 300);


            //Play - Pause Method. (Changes the Glyphicon).
            $('.play').click(function () {
                if (video.paused == true) {
                    video.play();
                    ($((this).children).prop('class', 'glyphicon glyphicon-pause'));
                } else {
                    video.pause();
                    ($((this).children).prop('class', 'glyphicon glyphicon-play'));
                }
            });

            //Stop - Comes to currentTime (0) , and tests to have the currect glyphicon in '.play' button.
            $('.stop').click(function () {
                if (!video.paused) {
                    $('.play').find('span').attr('class', 'glyphicon glyphicon-play');
                    video.pause();
                }
                video.currentTime = 0;
            });
            // Decreases the Speed. (Calls
            $('.slowly').click(function () {
                if (video.playbackRate > 0.2) {
                    video.playbackRate -= 0.1;
                    refreshSpeed(video.playbackRate);
                }
            });
            //Increases the Speed.
            $('.faster').click(function () {
                if (video.playbackRate < 2) {
                    video.playbackRate += 0.1;
                    refreshSpeed(video.playbackRate);
                }
            });
            //Refreshes the Speed Bar.
            function refreshSpeed(value) {
                $('.speed').text('X' + (value).toFixed(1));
                $('.sp').attr('aria-valuenow', 'Speed: X' + value).css('width', value * 50 + '%');
            }

            //Decreases the Volume
            $('.lessVolume').click(function () {
                if ($(video).prop('volume') > 0.15) {
                    refreshVolume(parseFloat(video.volume - 0.1).toFixed(1));
                }
            });
            //Increases the Volume
            $('.moreVolume').click(function () {
                if ($(video).prop('volume') == 0) {
                    $('.noVolume').css('color', 'white');
                }
                if ($(video).prop('volume') < 1) {
                    refreshVolume(parseFloat(video.volume + 0.1).toFixed(1));
                }
            });
            //It refreshes the Bar each time that changes the Volume. (It changes the class, and the width)
            function refreshVolume(value) {
                video.volume = value;
                if (value == 0) {
                    $('.vol').attr('class', 'progress-bar progress-bar-danger vol').attr('aria-valuenow', value * 100).css('width', 0.1 * 100 + '%');
                } else {
                    $('.vol').attr('class', 'progress-bar progress-bar-default vol').attr('aria-valuenow', value * 100).css('width', value * 100 + '%');
                }
            }

            //Tests if there is or not Volume, and calls the method sending parameters to reverse the state.
            $('.noVolume').click(function () {
                if (video.volume == 0) {
                    refreshVolume('0.4');
                    $(this).css('color', 'white');
                } else {
                    refreshVolume('0');
                    $(this).css('color', 'orange');
                }
            });

            // Loops the video, and changes glypicon's Color.
            $(".loop").click(function () {
                if (video.loop == true) {
                    video.loop = false;
                    $(this).css('color', 'white');
                } else {
                    video.loop = true;
                    $(this).css('color', 'orange');
                }
            });
            //If video is not looped, when it finished the ,play-pause button will be able to display 'play button'
            //cause it's stopped.
            video.addEventListener('ended', testPause, false);
            function testPause() {
                if (video.loop == false) {
                    video.currentTime = 0;
                    $('.play').find('span').attr('class', 'glyphicon glyphicon-play');
                }
            }

            // Full Screen Option.
            $('.fullScreen').click(function () {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullScreen) {
                    video.mozRequestFullScreen();
                } else if (video.webkitRequestFullScreen) {
                    video.webkitRequestFullScreen();
                } else if (video.msRequestFullScreen) {
                    video.msRequestFullScreen();
                }
            });

            //When the video is hovered, it will appear the buttons and the volume bar.
            $(video).hover(function () {
                $('.buttons').css('opacity', '0.9');
                $('.save').css('opacity', '0.9');
                $('.volume').css('opacity', '0.9');
            });
            //When the mouse leave the video, elements must disappeared.
            $(video).mouseleave(function () {
                if (!$('.buttons').is(':hover') && !($('.save').is(':hover')) && !($('.volume').is(':hover'))) {
                    $('.buttons').css('opacity', '0.0');
                    $('.save').css('opacity', '0.0');
                    $('.volume').css('opacity', '0.0');
                }
            });

            //Event Listener to (Display-Frames, Delete Button), it deletes localStorage and empties the modal.
            $('.deleteLocalStorage').click(function () {
                localStorage.clear();
                $('.modalFrames').html("");
                $('.modalStorage').modal('hide');
            });

            //Event Listener which gets data from LS, and displays it in a table (on modal) when displayFrames Button is clicked.
            $('.displayFrames').click(function () {
                var code = "";
                var datesStored = localStorage.getItem('data');
                var elements = JSON.parse(datesStored);
                code += "<div class='table-responsive'>";
                code += "<table class='table'>";
                code += "<tr><th>Name:</th><th>Frame</th></tr>"
                $.each(elements, function (index) {
                    code += '<tr><td>' + (elements[index]['name']) + '</td>';
                    code += '<td>' + (elements[index]['time']) + '</td></tr>';
                });
                code += "</table>";
                code += "</div>";
                $('.modalFrames').html(code);
            });
            //Once the Button of save Frame is clicked, the first time is to Pause the video. To get the most exactly frame. (Here will be displayed modal)
            $('.save').click(function () {
                video.pause();
            });
            // This button, sends the value inserted in the input, and passed to store() function. Current time too.
            //The modal will be hided.
            $('.saveFrame').click(function () {
                store(video.currentTime, $('#valueName').val());
                $('.modalAdd').modal('hide');
            });

            //Stores method's create objects with the Name and Time passed.
            //It gets all existing data in LS and it reinsert it with the new one into localStore.
            function store(time, name) {
                var obj = {
                    name: name,
                    time: time.toFixed(2)
                }
                var datesStored = localStorage.getItem('data');
                var contacts = [];
                if (datesStored) {
                    contacts = JSON.parse(datesStored);
                }
                contacts.push(obj);
                localStorage.setItem('data', JSON.stringify(contacts));
            }
        }
        /**
         * Key Down Listeners:
         * +: More Volume
         * -: Less Volume
         * left: slowyly
         * right: faster
         * l: loop
         * f: full screen
         * m: mute
         * d: Display Local Storage / Can be deleted too.
         * X : save data with LocalStorage.
         **/

        $(document).bind('keydown', 'right', function (e) {
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 32:
                    $(".play").click();
                    break;
                case 83:
                    $(".stop").click();
                    break;
                case 107:
                    $(".moreVolume").click();
                    break;
                case 109:
                    $(".lessVolume").click();
                    break;
                case 37:
                    $(".slowly").click();
                    break;
                case 39:
                    $(".faster").click();
                    break;
                case 77:
                    $(".noVolume").click();
                    break;
                case 76:
                    $(".loop").click();
                    break;
                case 70:
                    $(".fullScreen").click();
                    break;
                case 65:
                    $('.save').click();
                    break;
            }
        });
        base.init();

    };
    $.borja.videoPlayer.defaultOptions = {
        url: "",
        labelNoSupport: "Browser doesn't support this VideoPlayer",
        videoWidth: 700,
        videoName: 'My Video'
    };
    $.fn.borja_videoPlayer = function (getData, options) {
        return this.each(function () {
            (new $.borja.videoPlayer(this, getData, options));
        });
    };
    // This function breaks the chain, but returns
    // the myCorp.MyExample if it has been attached to the object.
    $.fn.getborja_videoPlayer = function () {
        this.data("borja.videoPlayer");
    };
})
(jQuery);