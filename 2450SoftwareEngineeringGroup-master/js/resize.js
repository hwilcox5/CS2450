/*Resizes divs based on screen size */

$(window).on('resize', function() {
	if($window).height() > 400) {
		$('#weather').addClass('small-12');
		$('#weather').removeClass('small-8');
	} else (
		$('#weather').addClass('small-8');
		$(weather').removeClass('small-12');
	)
}}