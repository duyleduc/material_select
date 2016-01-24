(function($) {

	$.fn.select_materialize = function(options) {
		var $this = this;

		var optionsNumber = this.children('option').length;
		var selectId = this.attr('id');

		var isMultiple = (typeof $this.attr('multiples')) != 'undefined' ;
		
		var settings = $.extend({}, options);

		selectId += '-' + guid();
		//hidden this select
		this.addClass('dd-select-hidden');

		//wrap a div
		this.wrap('<div class="dd-select"></div>');

		if (settings.placeholder) {
			$this.after('<input class="dd-selected dd-select-first-option" readonly="true"  id = "select-' + selectId + '" type="text"/>');
		} else {
		 	$this.after('<input class="dd-selected" readonly="true"  id = "select-' + selectId + '" type="text"/>');
		}

    	var $selectInput = this.next('input.dd-selected');
 
    	// Show the first select option in the styled div and trigger that 
    	$selectInput.val(this.children('option').eq(0).text()).trigger("change");
 
    	// Insert an unordered list after the styled div and also cache the list
    	var $list = $('<ul/>', {
        	'class': 'dd-select-options'
    	}).insertAfter($selectInput);
 
    	this.after('<span class="dd-select-caret">▼</span>');
    	buildSelect($this, isMultiple, $list, optionsNumber);
 
    	// Cache the list items
    	var $listItems = $list.children('li');
    	var listItemsNumber = $listItems.length;
 
	    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
	    $selectInput.click(function (e) {
	        e.stopPropagation();
	        
	        $('input.dd-select.active').each(function () {
	            $(this).removeClass('active').next('ul.options').hide();
	        });

	        $(this).toggleClass('active').next('ul.options').toggle();
	 
	        var width = $(this).innerWidth();

	        var windowHeight = $(window).height();

	        var windowScroll = $(window).scrollTop();
	        var selectInputPositon= $(this).offset().top;

	        var actualPosition = selectInputPositon - windowScroll;
	        
	        var maxHeight  = windowHeight - actualPosition;  
	 
	        $list.css({
	            'width': width + "px",
	            'max-height': maxHeight + "px",
	            'position': 'absolute',
	            'top': '0px',
	            'left': '0px',
	            'opacity': '1'
	        });

	        $list.show();
		});

		 // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    	// Updates the select element to have the value of the equivalent option
	    $listItems.click(function (e) {
	        
	        e.stopPropagation();
	       
	        $selectInput.removeClass('active');
	        
	        var value = $(this).attr("value");
	        if (!isMultiple) {
				selectSimple($selectInput, $listItems, $list, $(this), settings);
	       	} else {
	       		selectMultiple($selectInput, $listItems, $list, $(this), settings);
	       	}

	        $selectInput.trigger("change");
	    });
	 
	    // Hides the unordered list when clicking outside of it
	    $(window).click(function () {
	        $selectInput.removeClass('active');
	        $list.hide();
	    });
	};

	function selectSimple(selectInput,listItems, list, $this, settings) {

        if ($this.is($(":first-child")) && settings.placeholder) {
        	selectInput.addClass("dd-select-first-option");
        } else {
        	selectInput.removeClass("dd-select-first-option");
        }

        selectInput.val($this.find('span').text());
 
        listItems.each(function () {
            $(this).removeClass('dd-li-selected');
        });
 
        $this.addClass('dd-li-selected');
        list.hide();
	}

	function selectMultiple(selectInput,listItems, list, $this, settings) {
		var selectedValues = selectInput.val();

        if ($this.is($(".dd-select-options :first-child")) && settings.placeholder) {
        	selectInput.addClass("dd-select-first-option");
        	
        	listItems.each(function () {
            	$(this).removeClass('dd-li-selected');
        	});

        	selectedValues = $this.find('label').text();
        	selectInput.val(selectedValues);
        	$this.addClass('dd-li-selected');
        	list.hide();
        	return;
        } else {
        	var firstChild = $(".dd-select-options :first-child");
        	if (selectInput.hasClass('dd-select-first-option'))  {
	        	firstChild.removeClass('dd-li-selected');
	        	selectedValues = '';
	        	selectInput.removeClass("dd-select-first-option");
        	}
        }

        if ($this.hasClass('dd-li-selected')) {
        	$this.removeClass('dd-li-selected');
        	selectedValues = removeSelectedValue(selectedValues, $this.find('label').text());
        	selectInput.val(selectedValues);
        } else {
        	$this.addClass('dd-li-selected');
        	selectedValues += selectedValues=== '' ? $this.find('label').text() : ', ' + $this.find('label').text();
        	selectInput.val(selectedValues);
        }
	}

	function removeSelectedValue(selectedValues, valueToDelete) {
		valueToDelete = valueToDelete.trim();

		var valueToDeleteMiddle = new RegExp(valueToDelete+',', "g");
		var valueToDeleteReg = new ', ' + RegExp(valueToDelete, "g");
		selectedValues =  selectedValues.replace(valueToDeleteMiddle,'');//first or in middle
		selectedValues = selectedValues.replace(valueToDeleteReg,''); // at the end of string
		selectedValues.trim();

		return selectedValues;
	}
 	
 	function buildSelect(select, isMultiple, list, optionsNumber) {
 		// Insert a list item into the unordered list for each select option
    	if (isMultiple) {
	    	for (var i = 0; i < optionsNumber; i++) {
	        	$('<li/>', {
	            	html: '<span> <input type="checkbox"></input> <label>' + select.children('option').eq(i).text() + '</label></span>',
	            	value: select.children('option').eq(i).val()
	        	}).appendTo(list);
	    	}	
    	} else { 
    		for (var i = 0; i < optionsNumber; i++) {
	        	$('<li/>', {
	            	html: '<span> ' + select.children('option').eq(i).text() + '</span>',
	            	value: select.children('option').eq(i).val()
	        	}).appendTo(list);
	    	}
    	}
 	}

	function guid() {
 	 	function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000)
      		.toString(16)
      		.substring(1);
  		}
  		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    			s4() + '-' + s4() + s4() + s4();
	};
 
} (jQuery));