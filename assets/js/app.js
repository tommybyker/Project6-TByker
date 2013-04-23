/**************************************
TITLE: app.js (For Project 6)
 AUTHOR: Thomas J. Byker (TJB)
 CREATE DATE: 04.16.2013
 PURPOSE: Javascript code that performs various functions for Project 6.   
 LAST MODIFIED ON: 04.21.2013
 LAST MODIFIED BY: Thomas J. Byker (TJB)
 MODIFICATION HISTORY: GITHub Initial Push to Server 4.21.2013

***************************************/

;(function($, window) {
	
	// Javascript function that sets the Apple Theme from JQTouch.
	var jQT;
	
    
    $(function(){
	
	    jQT = new $.jQTouch({
	        statusBar: 'black-translucent',
	        preloadImages: []
	    });

    });
	
    // The toggle Javascript function displays or hides the matched elements.
	$('.toggle').click(function(e) {
		var $t = $(this);
		var id = $t.attr('href');
		var target = $(id);
		
		if(target.css('display') != 'none') {
			target.removeClass('show');
		}
		else {
			target.addClass('show');
		}
		
		e.preventDefault();
	});
	
	//  Javascript function that rotates matched elements.
	$('.bars').click(function(e) {
		var $t = $(this);
		
		if($t.hasClass('rotate')) {
			$t.removeClass('rotate');
		}
		else {
			$t.addClass('rotate');
		}
				
		e.preventDefault();
	});
	
	//  Javascript function that initiates Google Maps to the Home page.
	$('#home').bind('pageAnimationEnd', function(event, info) {
		if (info.direction == 'in') {
			$("#map").show();
			
			google.maps.event.trigger(map.map, 'resize');
			
			map.map.setZoom(map.mapOptions.zoom);
			map.map.fitBounds(map.bounds);
					
		}
		return false;
	});
	
	//  Javascript function that initiates the New Location page form.
	$('#new-location').submit(function(e) {
		
		var $t      = $(this);
		var $name   = $t.find('#name');
		var $street = $t.find('#street');
		var $city   = $t.find('#city');
		var $state  = $t.find('#state');
		var $zip    = $t.find('#zip');
		
		var address = [
			$street.val(),
			$city.val(),
			$state.val(),
			$zip.val()
		];
		
		var obj = {
			name: $name.val(),
			address: address.join(' '),
			street: $street.val(),
			city: $city.val(),
			state: $state.val(),
			zipcode: $zip.val()
		}
		
		map.addMarker(obj, function() {
			map.home();
			$name.val('');
			$street.val('');
			$city.val('');
			$state.val('');
			$zip.val('');
		});
		
		e.preventDefault();
		
		return false;
	});
	
	//  Javascript function that initiates the Edit Location page form when activating a Marker on the map.
	$('#edit-location').submit(function(e) {
		
		var $t      = $(this);
		var $name   = $t.find('#name');
		var $street = $t.find('#street');
		var $city   = $t.find('#city');
		var $state  = $t.find('#state');
		var $zip    = $t.find('#zip');
		
		var address = [
			$street.val(),
			$city.val(),
			$state.val(),
			$zip.val()
		];
		
		var obj = {
			name: $name.val(),
			address: address.join(' '),
			street: $street.val(),
			city: $city.val(),
			state: $state.val(),
			zipcode: $zip.val()
		}
		
		map.editMarker(obj, function() {
			map.home();
			$name.val('');
			$street.val('');
			$city.val('');
			$state.val('');
			$zip.val('');
		});
		
		e.preventDefault();
		
		return false;
	});
	
	//  Javascript function that initiates the Google Maps and works with editing existing markers.
	var map = $('#map').MyMap({
		mapOptions: {
			center: new google.maps.LatLng(39.9841, -86.1197)
		},
		callback: {
			newMarker: function(marker, lat, lng, index) {
				google.maps.event.addListener(marker, 'click', function() {
				
					map.editIndex = index;
					
					var row     = map.db.query('markers', function(row) {
						if(row.ID == index+1) {
							return true;
						}
						return false;
					});
					
					row = row[0];
					
					var form    = $('#edit-location');
					var $name   = form.find('#name');
					var $street = form.find('#street');
					var $city   = form.find('#city');
					var $state  = form.find('#state');
					var $zip    = form.find('#zip');
					
					$name.val(row.name);
					$street.val(row.street);
					$city.val(row.city);
					$state.val(row.state);	
					$zip.val(row.zipcode);
					
					jQT.goTo('#edit', 'slideup');		
					
				});
			}
		}
	});
	
	map.startSettings();
	
	//Clear Function
	$(".clear").on('click', function(e){
        map.clearSearch();
        e.preventDefault();
        $(this).hide();
    });
	
	//Search Function
    $('#search').on('submit', function(e) {
        var $t = $(this);
        var location = $t.find('#location').val();
        var distance = $t.find('#distance').val();

        map.search(location, distance);
        e.preventDefault();

        $(".clear").show();
    });
	
	//Delete Location Function
	$('#delete-location').on('submit', function(e) {
		map.delete_location(map.editIndex+1);
        jQT.goTo('#home', 'slideup');
	});
	
	//Setting Submit Function
	$("#settings-submit").on('click', function(e) {
		var s = {icon: $("#icon").val(), size: $("#size").val(), map_type: $("#map_type").val()};
		map.submitSettings(s);
		map.startSettings();
		jQT.goTo('#home', 'slideup');
	});	
    
	
}(jQuery, this));
