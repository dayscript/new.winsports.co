/**
 * @file
 * Placeholder file for custom sub-theme behaviors.
 *
 */
(function($, Drupal) {
    /**
     * Use this behavior as a template for custom Javascript.
     */
    Drupal.behaviors.tailwindcss = {
        attach: function(context, settings) {
            window.onload = function(){
                $('.loading').hide(); // hide the .loading class with the loading animation gif
            };
            let path = window.location.pathname;
            if (path.indexOf('partidos') >= 0) {
                /*$('#block-contenidoprincipaldelapagina-3').hide();
                //$('.tw-p-4').attr('style', 'padding:0 !important;');
                $(window).scroll(function() {
                    let scroll = $(window).scrollTop();
                    //console.log(scroll);
                    if (scroll >= 550 && scroll <= ($('#block-matchmenu').innerHeight())) {
                        $('#block-matchmenu').find('.tw-bg-gray').find('div[class*="tw-pl-6"]').css({
                            'position': 'fixed',
                            'right': (screen.width > 1366) ? '18.5%' : '5.5%',
                            'top': '20%',
                            'max-width': '300px',
                        });
                    } else {
                        $('#block-matchmenu').find('.tw-bg-gray').find('div[class*="tw-pl-6"]').css({
                            'position': 'relative',
                            'right': 'unset',
                            'top': 'unset',
                        });
                    }
                });*/
            }
            $( document ).ready(function() {
                setTimeout(function(){ 
                    var headerHeight = $('#header-page').height();
                    if(headerHeight > 100) {
                        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                            headerHeight = 48;
                        }else {
                            headerHeight = 108;
                        } 
                    }
                    $('#top-content').attr('style', 'margin-top:'+headerHeight+'px !important');
                    /*TopBanner Ads*/
                    if ($('#top-content #eplAdDivTop_Banner_NEW').length > 0) {/*Home Principal*/
                        if($('#top-content').hasClass('tw-hidden')){ $('#top-content').removeClass('tw-hidden'); }
                        if($('#horizontal-results').hasClass('tw-mt-12 md:tw-mt-29')){ $('#horizontal-results').removeClass('tw-mt-12 md:tw-mt-29'); }
                        $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
                    }else if ($('#top-content #eplAdDivInternas_TopBanner_728x90_Variable').length > 0) {/*Internas*/
                        if($('#top-content').hasClass('tw-hidden')){ $('#top-content').removeClass('tw-hidden'); }
                        if($('#horizontal-results').hasClass('tw-mt-12 md:tw-mt-29')){ $('#horizontal-results').removeClass('tw-mt-12 md:tw-mt-29'); }
                        $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
                    }else if ($('#top-content #eplAdDivBILLBOARDGOLES2 > a').length > 0) {/*Videos*/
                        if($('#top-content').hasClass('tw-hidden')){ $('#top-content').removeClass('tw-hidden'); }
                        if($('#horizontal-results').hasClass('tw-mt-12 md:tw-mt-29')){ $('#horizontal-results').removeClass('tw-mt-12 md:tw-mt-29'); }
                        $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
                    }else if ($('#top-content #eplAdDivTop_Banner').length > 0) {/*Estadisticas*/
                        if($('#top-content').hasClass('tw-hidden')){ $('#top-content').removeClass('tw-hidden'); }
                        if($('#horizontal-results').hasClass('tw-mt-12 md:tw-mt-29')){ $('#horizontal-results').removeClass('tw-mt-12 md:tw-mt-29'); }
                        $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
                    }else if ($('#top-content #eplAdDivHome_Header_1260x150').length > 0) {/*Home Mobile*/
                        if($('#top-content').hasClass('tw-hidden')){ $('#top-content').removeClass('tw-hidden'); }
                        if($('#horizontal-results').hasClass('tw-mt-12 md:tw-mt-29')){ $('#horizontal-results').removeClass('tw-mt-12 md:tw-mt-29'); }
                        $('#top-content').addClass('tw-mt-12 md:tw-mt-29');
                    }else {
                        $('#top-content').addClass('tw-hidden');
                        $('#horizontal-results').addClass('tw-mt-12 md:tw-mt-29');
                    }
                    /*TopBanner Ads*/
                 }, 3000);
            });
            
            setTimeout(function(){
                $('#block-horizontalresults').bind('DOMNodeInserted DOMNodeRemoved', function() {
                    if($('#block-horizontalresults div.is-active').length){
                        var x = $('#block-horizontalresults div.is-active').position();
                        var scrollLeft = x.left-155;
                        $('#block-horizontalresults div').animate({
                            scrollLeft: scrollLeft
                        }, 400);
                    }
                });
                if($('#block-futbolinternacional ul li a.is-active').length){
                    var x = $('#block-futbolinternacional ul li a.is-active').position();
                    var scrollLeft = x.left-100;
                    $('#block-futbolinternacional ul').animate({
                        scrollLeft: scrollLeft
                    }, 400);
                }
                if($('#block-futbolcolombiano ul li a.is-active').length){
                    var x = $('#block-futbolcolombiano ul li a.is-active').position();
                    var scrollLeft = x.left-100;
                    $('#block-futbolcolombiano ul').animate({
                        scrollLeft: scrollLeft
                    }, 400);
                }
                $("#block-views-block-videos-block-1 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
                $("#block-views-block-videos-block-4 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
                $("#block-views-block-videos-block-5 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
                $("#block-views-block-videos-block-6 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
                $("#block-views-block-videos-block-7 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
                $("#block-views-block-videos-block-9 .owl-carousel").data('owlCarousel').reinit({
                    items: 4.3,
                    itemsMobile : [479,2.2],
                    itemsTablet: [768,2.3],
                });
            }, 3000);

            $('#block-horizontalresults').bind('DOMNodeInserted DOMNodeRemoved', function() {
                if($('#block-horizontalresults div.is-active').length){
                    var x = $('#block-horizontalresults div.is-active').position();
                    var scrollLeft = x.left-155;
                    $('#block-horizontalresults div').animate({
                        scrollLeft: scrollLeft
                    }, 400);
                }
            });

            $(".opta-widgets-menu > div:nth-child(3)").insertAfter(".opta-widgets-menu > div:nth-child(5)");
            relocateView();
            $(window).resize(function() {
                relocateView();
            });

            function relocateView() {
                if ($(window).width() <= 768) {
                    $('#block-positionstableswidget').find('.opta-feeds-widget-positions').find('.scrollbar-w-2').attr('style', 'max-height: auto');
                    $('#block-envivo').addClass('tw-right-0 tw-absolute').insertAfter('#header-page .tw-flex.tw-items-center > div:first-child');
                    $('#block-customadsblock').insertAfter('#block-views-block-goles-home-block-2');
                    $('#block-customadsblock-4').insertAfter('#block-positionstableswidget');
                    $('#block-blocktabswidgetprogramacion').insertAfter('#block-customadsblock-4');
                    $('#block-customadsblock-5').insertAfter('#block-customadsblock-6');
                    $('#block-views-block-opinion-block-1').insertBefore('#block-views-block-lo-ultimo-block-5');
                    $('#block-customadsblock-9').addClass('tw-pb-8').insertAfter('#block-views-block-lo-ultimo-block-2');
                    $('#block-customadsblock-10').addClass('tw-pb-8').insertAfter('#block-futbolred');
                    $('#block-customadsblock-6').insertAfter('#block-views-block-lo-ultimo-block-4');
                    $('#block-customadsblock-25').insertAfter('.opta-tournament-stats');
                }else{
                    $('#block-positionstableswidget').find('.opta-feeds-widget-positions').find('.scrollbar-w-2').attr('style', 'max-height: 310px');
                }
/*                if ($(window).width() <= 768) {
                    $('#block-envivo').addClass('tw-right-0 tw-absolute').insertAfter('#header-page .tw-flex.tw-items-center > div:first-child');
                }*/
            }
        }
    };
})(jQuery, Drupal);