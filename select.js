function initSelect(selector) {
    var $this = selector,
            numberOfOptions = selector.children('option').length,
            selectId = selector.attr('id');
 
    // Hides the select element
    $this.addClass('s-hidden');
 
    // Wrap the select element in a div
    $this.wrap('<div class="select"></div>');
    // Insert a styled div to sit over the top of the hidden select element
    $this.after('<input class="styledSelect first_option" readonly="true"  id = "input-' + selectId + '" type="text"/>');
 
    // Cache the styled div
    var $styledSelect = $this.next('input.styledSelect');
 
    // Show the first select option in the styled div
    $styledSelect.val($this.children('option').eq(0).text()).trigger("change");
 
    // Insert an unordered list after the styled div and also cache the list
    var $list = $('<ul/>', {
        'class': 'options'
    }).insertAfter($styledSelect);
 
    $this.after('<span class="caret">▼</span>');
    // Insert a list item into the unordered list for each select option
    for (var i = 0; i < numberOfOptions; i++) {
        $('<li/>', {
            html: '<span>' + $this.children('option').eq(i).text() + '</span>',
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
    }
 
    // Cache the list items
    var $listItems = $list.children('li');
    var listItemsNumber = $listItems.length;
 
    // Show the unordered list when the styled div is clicked (also hides it if the div is clicked again)
    $styledSelect.click(function (e) {
        e.stopPropagation();
        $('input.styledSelect.active').each(function () {
            $(this).removeClass('active').next('ul.options').hide();
        });
        $(this).toggleClass('active').next('ul.options').toggle();
 
        var liHeight = parseInt($listItems.first().css("min-height"));
 
        var width = $styledSelect.innerWidth();
        var height = $(document).innerHeight() - $(".section-header").innerHeight() - 20;
 
        height = liHeight * listItemsNumber > height ? height : liHeight * listItemsNumber;
        var maxHeight = parseInt($(".options").css("max-height"));
        height = height > maxHeight ? maxHeight : height;
 
        $list.css({
            'width': width + "px",
            'height': height + "px",
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'opacity': '1'
        });
 
    });
 
    // Hides the unordered list when a list item is clicked and updates the styled div to show the selected list item
    // Updates the select element to have the value of the equivalent option
    $listItems.click(function (e) {
        e.stopPropagation();
        var textSelected = $(this).text();
 
        $styledSelect.removeClass('active');
        var rel = $(this).attr("rel");
 
        if (rel === "0" || rel === "") {
            $styledSelect.addClass("first_option");
        } else {
            $styledSelect.removeClass("first_option");
        }
 
        $this.val($(this).attr('rel'));
 
        $listItems.each(function () {
            $(this).removeClass('selected');
        });
 
        $(this).addClass('selected');
        $list.hide();
 
        $styledSelect.val(textSelected).trigger("change");
    });
 
    // Hides the unordered list when clicking outside of it
    $(document).click(function () {
        $styledSelect.removeClass('active');
        $list.hide();
    });
 
}