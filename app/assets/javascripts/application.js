// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.autocomplete
// require turbolinks
//= require bootstrap
//= require d3
//= require grades
//= require course_professors
//= require contact_us
//= require sign_up
//= require reviews

$('.dropdown-toggle').dropdown();

$(document).ready(function() {
	$('.professor_link').bind('ajax:success', function(xhr, data, status) {
		var target = $(this).data('update-target');
		alert(target);
		$('#' + target).html(data);
		$('#' + target).toggle();
	});

	$('#searchbox').autocomplete({
	source: function( request, response ) {
		$.ajax({
			url: '/search/search',
			dataType: 'json',
			type: 'GET',
			data: {
				query: request.term
		},
		success: function( data ) {
			response( $.map(data.slice(0,9), function( item ) {
			return {
				label: item.subdepartment_code + " " + item.course_number + "-" + item.last_name,
				value: "c=" + item.course_id + "&p=" + item.professor_id
			}
			}));
		}
		});
	},
	minLength: 2,
	focus: function(event, ui) {
		$('#searchbox').val(ui.item.label);
		return false;
	},
	select: function(event, ui) {
		$('#searchbox').val(ui.item.label);
		window.location = "/course_professors?" + ui.item.value;
		return false;
	},
	open: function() {
		$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		$(this).autocomplete('widget').css('z-index', 5000);
	},
	close: function() {
		$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
	}
	});

	

});

$(document).ready(function() {
	$("#prof_name").bind("change", function(){
		$("#prof_list").empty();
		var value = $(this).find(":selected").val();
		if (value == ""){
			return;
		}
		$.ajax({
			url: '/professors/',
			dataType: 'json',
			type: 'GET',
			success: function(data) {
				$.each(data, function(){
					if(this.last_name[0] == value) {
						$('#prof_list').append($("<a/>", {
							href: "/professors/" + this.id,
							text: this.last_name + ", " + this.first_name
						}));
						$('#prof_list').append($("<br/>", {						
						}));
					}
				});			
			}
		});
	});
});

jQuery.ajaxSetup({
  beforeSend: function() {
    $('#loading').fadeIn();
    $("#second_letter").show();

  },
  complete: function(){
    $('#loading').hide();
  },
  success: function() {}
});
