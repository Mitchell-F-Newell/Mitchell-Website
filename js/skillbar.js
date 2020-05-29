/* animate skill bars */
$('.skillbar').each(function(){
    $(this).find('.skillbar-bar').animate({
        width:jQuery(this).attr('data-percent')
    },2500);
});
    