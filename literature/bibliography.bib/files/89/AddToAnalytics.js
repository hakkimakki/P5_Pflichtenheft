function AddToAnalytics() {
    // Fetch data from form
    var firstname = $(".hs-form input[name=firstname]").val();
    var lastname = $(".hs-form input[name=lastname]").val();
    var email = $(".hs-form input[name=email]").val();
    var phone = $(".hs-form input[name=mobilephone]").val();
    var company = $(".hs-form input[name=company]").val();
    var country = $('select[name=country]').find('option:selected').val();

    var url = '/api/sitecore/PageComponents/AddContactToAnalytics?contactid=' +
        contactid +
        '&firstname=' +
        firstname +
        '&lastname=' +
        lastname +
        "&email=" +
        email +
        "&phone=" +
        phone +
        "&company=" +
        company +
        "&country=" +
        country;
    
    if (typeof goalid !== 'undefined') {
        url = url + '&goalid=' + goalid;
    }

    var request = jQuery.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        url: url,
        success: function (e) {
                //console.log('my message' + e);
        },
        error: function (e) {

        }
    });
}


//loop through each label and make inline placeholder
function addPlaceholder() {
    $(".form-columns-2 .hs-form-field:not(.smart-field)").each(function () {
        var label = $(this);
        span1 = label.find('span:not(.hs-form-required)');
        span2 = label.find('span.hs-form-required');
        span1.hide();
        span2.hide();
        label.find(".hs-input").attr("placeholder", span1.text() + span2.text()).val("").focus().blur();
    });

    $(".form-columns-1 .hs-form-field:not(.smart-field):not(.hs_product_updates_subscriptions):not(.hs_i_accept_the_privacy_policy_for_this_website)").each(function () {
        var label = $(this);
        span1 = label.find('span:not(.hs-form-required)');
        span2 = label.find('span.hs-form-required');
        span1.hide();
        span2.hide();
        label.parent().find(".hs-input").attr("placeholder", span1.text() + span2.text()).val("").focus().blur();
    });

    $(".form-columns-1 .smart-field").each(function () {
        var label = $(this);
        span1 = label.find('span:not(.hs-form-required)');
        span2 = label.find('span.hs-form-required');
        span1.hide();
        span2.hide();
        label.parent().find(".hs-input").attr("placeholder", span1.text() + span2.text()).val("").focus().blur();
    });


    $('.hbspt-form input[name=file_upload]').each(function () {
        var input = $(this).parent();
        var thisVal = $(this);
        $('<span class="valFromFile">File Upload</span>').insertAfter(input);

        $(this).change(function () {
            var filename = this.value.match(/[^\\\/]+$/, '')[0];
            $('<span class="valFromFile">' + filename + '</span>').insertAfter(input);
        });

    });

}