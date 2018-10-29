Globals = {
    mainNewsBlock: {
        isNewsTimerActive: true,
        isRemovingNews: false
    }

};

function cloneToPrepend(list, collection) {
    collection.slice().reverse().forEach(function (elem) {
        elem = elem.cloneNode(true);
        elem.classList.add('cloned');
        list.prepend(elem);
    });
}
function cloneToAppend(list, collection) {
    collection.slice().forEach(function (elem) {
        elem = elem.cloneNode(true);
        elem.classList.add('cloned');
        list.append(elem);
    });
}


jQuery(document).ready(function($) {
    $(function(){
    $('#mainCarousel').carousel({
      interval: 4000
    });
});
});

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
    g = newsList;
    var newsTimerProcess = newsMain.find('.news-timer')[0];
    var timeout;

    var cssString = '.news-main .news-timer.news-timer-start { -webkit-animation-duration: ' + time + 'ms; -moz-animation-duration: ' + time + 'ms; -ms-animation-duration: ' + time + 'ms; -o-animation-duration: ' + time + 'ms;animation-duration: ' + time + 'ms;}';
    cssString += ' .news-block .news-sidebar .media.removing { -webkit-animation-duration: ' + animTime + 'ms; -moz-animation-duration: ' + animTime + 'ms; -ms-animation-duration: ' + animTime + 'ms; -o-animation-duration: ' + animTime + 'ms;animation-duration: ' + animTime + 'ms;}';
    var style=document.createElement('style');
    style.type='text/css';
    if(style.styleSheet){
        style.styleSheet.cssText=cssString;
    }else{
        style.appendChild(document.createTextNode(cssString));
    }
    document.getElementsByTagName('head')[0].appendChild(style);

    function parseNews(elem) {
        return {
            image: elem.find('img').attr('src'),
            heading: elem.find('.media-heading, .heading').html(),
            paragraph: elem.find('p').html(),
            elem: elem,
            href: elem.find('a').attr('href')
        }
    }

    function renderMainNews(data) {
        newsMain.find('img').attr('src',data.image);
        newsMain.find('.heading').html(data.heading);
        newsMain.find('.paragraph').html(data.paragraph);
        newsMain.trigger('news-changed');
        newsMain.find('a').attr('href', data.href);
    }

    function renderNewsList(data) {
        var renderHTML = '<div class="news-media media"><a href="' + data.href + '" onclick="return false"><div class="media-left"><div class="news-media-image"><img class="media-object" src="' + data.image + '" alt="' + data.heading + '"></div></div><div class="media-body"><h5 class="media-heading" title="' + data.heading + '">' + data.heading + '</h5><p class="small">' + data.paragraph + '</p></div></a></div>';
        newsList.append(renderHTML);
    }

    function switchNewsWithRemove(elem) {
        var oldNewsData = parseNews(newsMain);
        var newNewsData = parseNews(elem);
        elem.addClass('removing');
        setTimeout(function(){
            renderMainNews(newNewsData);
            renderNewsList(oldNewsData);
            elem.remove();
        },animTime);
    }
    function switchNews(elem) {
        elem.siblings().removeClass('active');
        elem.addClass('active');
        var newNewsData = parseNews(elem);
        renderMainNews(newNewsData);
    }

    function startTimeout() {
        if (!newsTimerProcess) return;
        newsTimerProcess.classList.add('news-timer-start');
        timeout = setTimeout(function(){
            var news = newsList.find('.news-media.active+.news-media')[0];
            if (!news) {
                news = newsList.find('.news-media')[0];
            }
            onSwitchNews($(news));
        }, time);
    }

    // $(document).on('click','#main-news-block .news-media:not(.removing)',function() {
    //     onSwitchNews($(this));
    // });

    function onSwitchNews(news) {
        if (Globals.mainNewsBlock.isRemovingNews) {
            switchNewsWithRemove(news);
        } else {
            switchNews(news);
        }
    }

    newsMain.on('news-changed', function(){
        var n = newsTimerProcess.cloneNode(true);
        n.classList.remove('news-timer-start');
        newsTimerProcess.parentNode.replaceChild(n, newsTimerProcess);
        newsTimerProcess = n;
        clearTimeout(timeout);
        if (Globals.mainNewsBlock.isNewsTimerActive) {
            startTimeout();
        }
    });

    if (Globals.mainNewsBlock.isNewsTimerActive) {
        startTimeout();
    }
});

//Certificates slider
jQuery(document).ready(function($) {
    [].slice.call(document.getElementsByClassName('slider-wrapper')).map(function (item) {
        var list = item.getElementsByClassName('slider-list').item(0);
        var listChild = [].slice.call(list.children);
        cloneToAppend(list, listChild);
        cloneToPrepend(list, listChild);
        list.firstElementChild.style.marginLeft = -1 * listChild.length * list.firstElementChild.offsetWidth + 'px';
    });
    [].slice.call(document.getElementsByClassName('slider-control')).map(function (item) {
        item.onclick = function () {
            const targetName = item.dataset['target'];
            const navigation = item.dataset['navigation'];
            if (!targetName || !navigation) return;
            const target = document.querySelector( targetName );
            if ( !target ) return;
            moveSlider(target, navigation);
        }
    });
    function moveSlider(item, navigation) {
        if (!item.classList.contains('slider-wrapper')) return;
        var list = item.getElementsByClassName('slider-list')[0];
        var first = list.firstElementChild;
        var style = first.style;
        var offset = first.offsetWidth;
        var marginLeft = parseInt(style.marginLeft);
        var listWidth = (list.childElementCount/3) * list.firstElementChild.offsetWidth;
        marginLeft = isNaN(marginLeft) ? 0 : marginLeft;
        marginLeft = marginLeft + offset * ((navigation === 'prev') ? 1 : -1);
        style.marginLeft = marginLeft + 'px';
        var goToOrigin = function() {
            first.style.transition = '0s';
            marginLeft = -1 * listWidth;
            style.marginLeft = marginLeft + 'px';
            setTimeout(function(){
                first.style.transition = '200ms';
            }, 10);
        };
        if (marginLeft >= 0 || marginLeft <= listWidth * -2 ) {
            var time = parseFloat(getComputedStyle(first).getPropertyValue('transition-duration'))*1000;
            setTimeout(goToOrigin, time);
        }
        return item;
    }
});