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