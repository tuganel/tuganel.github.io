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
    var newsMain = $("#news-main");
    var newsList = $("#news-list .news-media");
    var active = 0;
    var timeout;

    var style=document.createElement('style');
    var cssStyle = ' .news-block .news-sidebar .media.active:before { -webkit-animation-duration: ' + time + 'ms; -moz-animation-duration: ' + time + 'ms; -o-animation-duration: ' + time + 'ms; animation-duration: ' + time + 'ms;} ';
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=cssStyle;
    }else{
        style.appendChild(document.createTextNode(cssStyle));
    }
    document.getElementsByTagName('head')[0].appendChild(style);


    function getNews(elem) {
        return {
            image: elem.find('img').attr('src'),
            heading: elem.find('.media-heading').html(),
            paragraph: elem.find('p').html(),
            elem: elem
        }
    }
    function setActiveNews(elem) {
        newsList.removeClass('active');
        elem.addClass('active');
    }
    function renderMainNews(data) {
        newsMain.find('img').attr('src',data.image);
        newsMain.find('.heading').html(data.heading);
        newsMain.find('.paragraph').html(data.paragraph);
        newsMain.trigger('news-changed');
    }
    function onSwitchNews(number) {
        var news = newsList.eq(number);
        renderMainNews(getNews(news));
        setActiveNews(news);
    }

    function startTimeout() {
        timeout = setTimeout(function(){
            active += 1 ;
            active %= newsList.length;
            onSwitchNews(active);
        }, time);
    }

    $(newsMain).on('news-changed', function(){
        clearTimeout(timeout);
        startTimeout();
    });

    startTimeout();
});