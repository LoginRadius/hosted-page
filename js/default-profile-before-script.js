var successMessages = {
    AccountLinked: "Account linked successfully.",
    ProfileUpdated: "Profile updated successfully.",
    AccountUnlinked: "Account unlinked successfully.",
    PasswordSet: "Pasword set successfully.",
    PaswordChanged: "Pasword changed successfully.",
    AccountDeleted: "Account deleted successfully."
};


window.lr_raas_settings = window.lr_raas_settings || {};

window.lr_raas_settings.accountLinking = {};
window.lr_raas_settings.accountLinking.linkedAccountsTemplate = "linkedAccountsTemplate";
window.lr_raas_settings.accountLinking.notLinkedAccountsTemplate = "notLinkedAccountsTemplate";
window.lr_raas_settings.accountLinking.containerid = "lr-linked-social,lr-not-linked-social";
window.lr_raas_settings.accountLinking.success = function () {
    setMessage(successMessages.AccountLinked);
};
window.lr_raas_settings.accountLinking.error = function (error) {
    setApiMessage(error);
};


window.lr_raas_settings.profileEditor = {};
window.lr_raas_settings.profileEditor.containerid = "profile-editor-container";
window.lr_raas_settings.profileEditor.error = function (errors) {
    if (!errors[0].rule)
        setApiMessage(errors);
    
};
window.lr_raas_settings.profileEditor.success = function (response) {
    setMessage(successMessages.ProfileUpdated);
};


window.lr_raas_settings.setPassword = {};
window.lr_raas_settings.setPassword.containerid = "set-password";
window.lr_raas_settings.setPassword.succes = function () {
    visibleLoadingSpinner(true);
};
window.lr_raas_settings.setPassword.error = function() {
    visibleLoadingSpinner(false);
};


window.lr_raas_settings.changePassword = {};
window.lr_raas_settings.changePassword.containerid = "change-password";
window.lr_raas_settings.changePassword.succes = function () {
    visibleLoadingSpinner(true);
};
window.lr_raas_settings.changePassword.error = function () {
    visibleLoadingSpinner(false);
};


for (var i = 0; i < LoginRadiusRaaS.RegistrationFormSchema.length; i++) {
    if (LoginRadiusRaaS.RegistrationFormSchema[i].name == "birthdate") {
        showBirthdateDatePicker();
    }
}



if (completedFormAction !== 'null' && completedFormAction !== '') {
    switch (completedFormAction) {
        case "noaction":
            break;
        case "unlink":
            setApiMessage(apiResponse, successMessages.AccountUnlinked);
            break;
        case "link":
            setApiMessage(apiResponse, successMessages.AccountLinked);
            break;
        case "setpassword":
            setApiMessage(apiResponse, successMessages.PasswordSet);
            break;
        case 'changepassword':
            setApiMessage(apiResponse, successMessages.PaswordChanged);
            break;
        case 'delete':
            setApiMessage(apiResponse, successMessages.AccountDeleted);
            window.location = "auth.aspx";
            break;
        default:
            break;
    }
}


LoginRadiusRaaS.$hooks.setRenderProfileEditor(function (profile, viewerSchema) {


    $(".lr-profile-name").text((profile.FirstName ? profile.FirstName : "") + " " + (profile.LastName ? profile.LastName : ""));

    if (profile.City != null && profile.City != '' && profile.City != 'unknown') {
        $(".lr-profile-info").find("p").text(profile.City, ", " + profile.Country);
    }

    if (profile.ImageUrl != null && profile.ImageUrl != '') {
        $(".lr-profile-image").find('img').attr("src", profile.ImageUrl);
    } else {
        $(".lr-profile-image").find('img').attr("src", loginRadiusCdnUrl + "/hosted-page-default-images/no_image.png");
    }

    var renderedHtml = "";
    for (var i = 0; i < viewerSchema.length; i++) {
        renderedHtml += LoginRadiusRaaS.hashTmpl("profileViewTemplate", viewerSchema[i]);
    }
    $("#profile-viewer").html(renderedHtml);
    visibleLoadingSpinner(false);
});

LoginRadiusRaaS.$hooks.setProcessHook(function () {
    visibleLoadingSpinner(true);
}, function () { });



function setApiMessage(apiResponse, message) {
    if (apiResponse.errorCode) {
        jQuery("#lr-raas-message").show().removeClass("loginradius-raas-success-message").addClass("loginradius-raas-error-message").text(apiResponse.description).delay(10000).fadeOut(300);
    } else {
        jQuery("#lr-raas-message").show().removeClass("loginradius-raas-error-message").addClass("loginradius-raas-success-message").text(message).delay(10000).fadeOut(300);
    }
    visibleLoadingSpinner(false);
}


function setMessage(msg, isError) {
    if (isError) {
        jQuery("#lr-raas-message").show().addClass("loginradius-raas-error-message").removeClass("loginradius-raas-success-message").text(msg).delay(10000).fadeOut(300);
    } else {
        jQuery("#lr-raas-message").show().addClass("loginradius-raas-success-message").removeClass("loginradius-raas-error-message").text(msg).delay(10000).fadeOut(300);
    }
    visibleLoadingSpinner(false);
}



// Specify the which element holds the forms
var $form_frame = $(".lr-forms-container .lr-form-frame");

// Specify the which element holds the social login
var $social_frame = $("#lr-social-login");

var showForgotPassword = function () {
    $form_frame.hide();
    $("#lr-raas-forgotpassword").show();
}

var showLogin = function () {
    $form_frame.hide();
    $("#lr-traditional-login").show();
}

var showRegister = function () {
    $form_frame.hide();
    $("#lr-raas-registartion").show();
}

jQuery(".lr-raas-forgot-password").click(showForgotPassword);
jQuery(".lr-raas-login-link").click(showLogin);
jQuery(".lr-register-link").click(showRegister);

// Show menu on navicon click
$('.lr-account-menu .lr-menu-button').click(function (e) {
    $(this).toggleClass('lr-active');
    $('.lr-account-menu .lr-menu-list-frame').slideToggle(200);
    e.stopPropagation();
});

// hide menu on any click
$(document).click(function () {

    if ($('.lr-account-menu .lr-menu-list-frame').is(":visible")) {

        $('.lr-account-menu .lr-menu-button').removeClass('lr-active');
        $('.lr-account-menu .lr-menu-list-frame').slideUp(200);
    };
});


function visibleLoadingSpinner(isvisible) {
    if (isvisible) {
        $("#loading-spinner").show();
    } else {
        $("#loading-spinner").hide();
    }
}
/*
*
* Hides and show settings 
*/

$('.lr-show-settings').click(function (e) {
    var dataQuery = $(this).attr('data-query');
    $('.lr-more-menu-contents .lr-more-menu-frame').hide();
    $('.lr-more-menu-contents #' + dataQuery).show()
    $('.lr-more-menu-contents').addClass('lr-show');
});

$('.lr-close').click(function () {
    $('.lr-more-menu-contents').removeClass('lr-show');
});



function showBirthdateDatePicker() {
    var maxYear = new Date().getFullYear();
    var minYear = maxYear - 100;
    $('body').on('focus', ".loginradius-raas-birthdate", function () {
        $('.loginradius-raas-birthdate').datepicker({
            dateFormat: 'mm-dd-yy',
            maxDate: new Date(),
            minDate: "-100y",
            changeMonth: true,
            changeYear: true,
            yearRange: (minYear + ":" + maxYear)
        });
    });
}