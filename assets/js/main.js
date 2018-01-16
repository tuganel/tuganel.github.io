/* Gallery slider animation */
jQuery(document).ready(function($) {

    var galleryCarousel = $('#galleryCarousel');
    var thumbnails = $('[id^=carousel-selector-]');

    galleryCarousel.carousel({
        interval: 5000
    });

    function updateActiveThumb() {
        var id = $('.item.active').eq(1).data('slideNumber');
        thumbnails.removeClass('active');
        $('#carousel-selector-' + id).addClass('active');
    }

    //Handles the carousel thumbnails
    thumbnails.click(function () {
        var id_selector = $(this).attr("id");
        try {
            var id = /-(\d+)$/.exec(id_selector)[1];
            $(thumbnails).removeClass('active');
            $(this).addClass('active');
            console.log(id_selector, id);
            galleryCarousel.carousel(parseInt(id));
        } catch (e) {
            console.log('Regex failed!', e);
        }
    });
    // When the carousel slides, auto update the text
    galleryCarousel.on('slid.bs.carousel', function (e) {
        updateActiveThumb();
    });

    updateActiveThumb();
});

/* News block animation*/
jQuery(document).ready(function($) {

    var time = 10000;
    var animTime = 300;
    var newsMain = $("#news-main");
    var newsList = $("#news-list");
    var timeout;

    var cssString = '.news-main .news-timer { -webkit-animation-duration: ' + time + 'ms; -moz-animation-duration: ' + time + 'ms; -ms-animation-duration: ' + time + 'ms; -o-animation-duration: ' + time + 'ms;animation-duration: ' + time + 'ms;}';
    cssString += ' .news-block .news-sidebar .media.removing { -webkit-animation-duration: ' + animTime + 'ms; -moz-animation-duration: ' + animTime + 'ms; -ms-animation-duration: ' + animTime + 'ms; -o-animation-duration: ' + animTime + 'ms;animation-duration: ' + animTime + 'ms;}';
    var style=document.createElement('style');
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=cssString;
    }else{
        style.appendChild(document.createTextNode(cssString));
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    function getNews(elem) {
        return {
            image: elem.find('img').attr('src'),
            heading: elem.find('.media-heading, .heading').html(),
            paragraph: elem.find('p').html(),
            elem: elem
        }
    }

    function renderMainNews(data) {
        newsMain.find('img').attr('src',data.image);
        newsMain.find('.heading').html(data.heading);
        newsMain.find('.paragraph').html(data.paragraph);
        newsMain.trigger('news-changed');
    }

    function renderNewsList(data) {
        var renderHTML = '<div class="news-media media"><div class="media-left"><a href="#"><div class="news-media-image"><img class="media-object" src="' + data.image + '" alt="' + data.heading + '"></div></a></div><div class="media-body"><h5 class="media-heading" title="' + data.heading + '">' + data.heading + '</h5><p class="small">' + data.paragraph + '</p></div></div>';
        newsList.append(renderHTML);

    }

    function onSwitchNews(elem) {
        var oldNewsData = getNews(newsMain);
        var newNewsData = getNews(elem);
        elem.addClass('removing');
        setTimeout(function(){
            renderMainNews(newNewsData);
            renderNewsList(oldNewsData);
            elem.remove();
        },animTime);
    }

    function startTimeout() {
        timeout = setTimeout(function(){
            var news = newsList.find('.news-media').eq(0);
            onSwitchNews(news);
        }, time);
    }

    $(document).on('click','.news-media',function() {
        onSwitchNews($(this));
    });


    newsMain.on('news-changed', function(){
        var elm = newsMain.find('.news-timer')[0];
        var n = elm.cloneNode(true);
        elm.parentNode.replaceChild(n, elm);
        console.log(elm);
        clearTimeout(timeout);
        startTimeout();
    });

    startTimeout();
});