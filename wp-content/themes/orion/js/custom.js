//jQuery.noConflict();

jQuery(document).ready(function($) {


$(function(){
	$('#menu ul.menu')
	.find('li.current_page_item,li.current_page_parent,li.current_page_ancestor,li.current-cat,li.current-cat-parent,li.current-menu-item')
		.addClass('active')
		.end()
		.superfish({autoArrows	: true});
});


$(function(){
	// fading images
	$(".gallery-item img").fadeTo("slow", 0.6); // This sets the opacity of the thumbs to fade down to 60% when the page loads
	$(".gallery-item img").hover(function(){
	$(this).fadeTo("400", 1.0); // This should set the opacity to 100% on hover
	},
	function(){
	$(this).fadeTo("400", 0.6); // This should set the opacity back to 60% on mouseout
	});
});


$(function(){
$('p.tags a')
.wrap('<span class="st_tag" />');
});



// TAB PANEL
$(function(){
	//Default Action
		$(".tabcontent").hide(); //Hide all content
		$(".tabcontentwide").hide(); //Hide all content
		
		//  Get the parameter value after the # symbol
	    var url=document.URL.split('#')[1];
	    if(url == undefined){
	        url = '';
	    }

	  // If the parameter exists
	    if(url != ''){
	        var urlactivetab = url;
					var currentObject = $('#tabnav li a.'+urlactivetab).attr('class');
					//alert(currentObject);
					$("."+currentObject).parent().addClass("active"); 
					$("#tabnav li a."+currentObject).addClass("active").fadeIn('fast'); //Activate first tab
					$("#"+currentObject+".tabcontent").show(); //Show first tab content
					
	    } else {
					// If the parameter does not exist just set the first item as active
					$("#tabnav li:first").addClass("active").fadeIn('fast'); //Activate first tab
					$(".tabcontent:first").show(); //Show first tab content
					$(".tabcontentwide:first" ).show(); //Show first tab content
			}
			//On Click Event
			$("#tabnav li").click(function() {
				$("#tabnav li").removeClass("active"); //Remove any "active" class
				$(this).addClass("active"); //Add "active" class to selected tab
				$(".tabcontent").hide(); //Hide all content
				$(".tabcontentwide").hide() //Hide all content
				var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
				$(activeTab).stop().fadeIn(200); //Fade in the active content
				return false;
			});
});
	
// TOGGLE
$(function(){
	$(".toggle_container").hide(); 
	//Switch the "Open" and "Close" state per click then slide up/down (depending on open/close state)
	$("p.trigger").click(function(){
		$(this).toggleClass("active").next().slideToggle("normal");
		return false; //Prevent the browser jump to the link anchor
	});					
});

// OPEN LINKS IN NEW WINDOW
$(function() {
	$('a[rel*=external]').click( function() {
		window.open(this.href);
		return false;
	});
});

// JavaScript Document

/* 
 * Cross-browser event handling, by Scott Andrew
 */
function addEvent(element, eventType, lamdaFunction, useCapture) {
    if (element.addEventListener) {
        element.addEventListener(eventType, lamdaFunction, useCapture);
        return true;
    } else if (element.attachEvent) {
        var r = element.attachEvent('on' + eventType, lamdaFunction);
        return r;
    } else {
        return false;
    }
}

/*
 * Clear Default Text: functions for clearing and replacing default text in
 * <input> elements.
 *
 * by Ross Shannon, http://www.yourhtmlsource.com/
 */

addEvent(window, 'load', init, false);

function init() {
    var formInputs = document.getElementsByTagName('input');
    for (var i = 0; i < formInputs.length; i++) {
        var theInput = formInputs[i];
        
        if (theInput.type == 'text' && theInput.className.match(/\bcleardefault\b/)) {  
            /* Add event handlers */          
            addEvent(theInput, 'focus', clearDefaultText, false);
            addEvent(theInput, 'blur', replaceDefaultText, false);
            
            /* Save the current value */
            if (theInput.value != '') {
                theInput.defaultText = theInput.value;
            }
        }
    }
}

function clearDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    
    if (target.value == target.defaultText) {
        target.value = '';
    }
}

function replaceDefaultText(e) {
    var target = window.event ? window.event.srcElement : e ? e.target : null;
    if (!target) return;
    
    if (target.value == '' && target.defaultText) {
        target.value = target.defaultText;
    }
}


});

// Reverses the z-indexing for correcting ie7 z-index issues
/*jQuery(function() {
	var zIndexNumber = 1000;
	jQuery('div').each(function() {
		jQuery(this).css('zIndex', zIndexNumber);
		zIndexNumber -= 10;
	});
});*/
	

