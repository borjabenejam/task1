(function ($) {
    if (!$.borja) {
        $.borja = new Object();
    }
    ;
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
                videoWidth: base.options.videoWidth
            });
        };
        // Sample Function, Uncomment to use
        base.render = function (data) {
            var code = "<div class='container videoCont'><div class='row'>";
            code += "<video id='" + base.id + "' class='video' width='" + data.videoWidth + "'><source id='sourceID1' src='" + data.videoUrl + "'> </video>";
            var button = "<button type='{0}' id='{3}' title='{4}' class='btn btn-default box {1}'><span class='glyphicon {2}' aria-hidden='true'></span></button>";
            var label = "<div id='{0}' title='{3}' class='{1}'>{2}</div>";


            var obj = {
                label1: ["info speed", "speed"],
                label2: ["info volume", "volume"],
                button1: ["text", "play", "glyphicon-play"],
                button2: ["text", "stop", "glyphicon-stop"],
                button3: ["text", "slowly", "glyphicon-fast-backward"],
                button4: ["text", "faster", "glyphicon-fast-forward"],
                button5: ["text", "lessVolume", "glyphicon-volume-down"],
                button6: ["text", "moreVolume", "glyphicon-volume-up"],
                button7: ["text", "noVolume", "glyphicon-volume-off"],
                button8: ["text", "loop", "glyphicon-repeat"],
                button9: ["text", "fullScreen", "glyphicon-fullscreen"],
                button10: ["text", "deleteLocalStorage", "glyphicon-trash"]
            };

            $.each(obj, function (index) {
                if (startsWith(index, "button")) {
                    code += button.format(this[0], this[1], this[2], randomID(), this[1]);
                } else {
                    code += label.format(randomID(), this[0], this[1], this[1]);
                }
            });
            code += "<div class='info data'></div>";
            code += "</div>";
            base.$el.html(code);


            // Run initializer
            base.addListeners();
        };
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/\{\{|\}\}|\{(\d+)\}/g, function (curlyBrack, index) {
                return ((curlyBrack == "{{") ? "{" : ((curlyBrack == "}}") ? "}" : args[index]));
            });
        };
        function startsWith(string, prefix) {
            return string.slice(0, prefix.length) == prefix;
        }

        base.addListeners = function () {
            var video = $('#' + base.id)[0];

            $('.play').click(function () {
                if (video.paused) {
                    video.play();
                    ($((this).children).prop('class', 'glyphicon glyphicon-pause'));
                } else {
                    video.pause();
                    ($((this).children).prop('class', 'glyphicon glyphicon-play'));
                }
            });
            $('.stop').click(function () {
                if (!video.paused) {
                    $('.play').click();
                }
                video.currentTime = 0;
            });

            $('.slowly').click(function () {
                if (video.playbackRate > 0.2) {
                    video.playbackRate -= 0.1;
                    $('.speed').text("Speed: x" + (video.playbackRate).toFixed(2));
                }
            });
            $('.faster').click(function () {
                if (video.playbackRate < 2) {
                    video.playbackRate += 0.1;
                    $('.speed').text("Speed: x" + (video.playbackRate).toFixed(2));
                }
            });
            $('.lessVolume').click(function () {
                if (video.volume > 0.1) {
                    video.volume -= 0.1;
                    $('.volume').text('Volume: ' + (video.volume).toFixed(2) * 100 + ('%'));
                }
            });
            $('.moreVolume').click(function () {
                if (video.volume < 1) {
                    video.volume += 0.1;
                    $('.volume').text('Volume: ' + (video.volume).toFixed(2) * 100 + ('%'));
                }
            });
            $('.noVolume').click(function () {
                video.volume = 0;
                $('.volume').text('Volume: ' + (video.volume).toFixed(2) * 100 + ('%'));
            });
            $(".loop").click(function () {
                if (video.loop == true) {
                    video.loop = false;
                } else {
                    video.loop = true;
                }
            });
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
            $('.deleteLocalStorage').click(function(){
                if(confirm("Do you really want to delete all stored Information?")){
                    localStorage.clear();
                    $('.data').html('');
                }
            });


            /**
             * +: More Volume
             * -: Less Volume
             * left: slowyly
             * right: faster
             * l: loop
             * f: full screen
             * m: mute
             * F2 : save data with LocalStorage
             **/
            $(document).bind('keydown', 'right', function (e) {
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
                    case 113:
                        askForInformation();
                        break;
                }
            });
            function askForInformation() {
                video.pause();
                var time = video.currentTime.toFixed(3);
                if(confirm("Do you want to save this instant: [" + video.currentTime + "] ?")){
                    store(time);
                    video.play();
                }
            }

            function store(time) {
                var datesStored = localStorage.getItem('data');
                var contacts = [];
                var code = '<ol>';
                if (datesStored) {
                    contacts = JSON.parse(datesStored);
                }
                contacts.push(time);
                localStorage.setItem('data', JSON.stringify(contacts));
                var html = '<li>{0}</li>';
                $.each(contacts, function (index) {
                    code += html.format(contacts[index]);
                });
                code += '</ol>';
                $('.data').html(code);
            }
        }
        base.init();

    };
    $.borja.videoPlayer.defaultOptions = {
        url: "",
        labelNoSupport: "Browser doesn't support this VideoPlayer",
        videoWidth: 700
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
})(jQuery);