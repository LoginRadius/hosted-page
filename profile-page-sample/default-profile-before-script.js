
    var successMessages = {
        AccountLinked: "Account linked successfully.",
        ProfileUpdated: "Profile updated successfully.",
        AccountUnlinked: "Account unlinked successfully.",
        PasswordSet: "Password set successfully.",
        PaswordChanged: "Password changed successfully.",
        AccountDeleted: "Account deleted successfully.",
        DeleteVerification: "Email for Delete Account has been sent to your provided email id, check email for further instructions"
    };

    window.lr_raas_settings = window.lr_raas_settings || {};

    window.lr_raas_settings.accountLinking = {};
    window.lr_raas_settings.accountLinking.templateName = "";
    window.lr_raas_settings.accountLinking.linkedAccountsTemplate = "linkedAccountsTemplate";
    window.lr_raas_settings.accountLinking.notLinkedAccountsTemplate = "notLinkedAccountsTemplate";
    window.lr_raas_settings.accountLinking.containerid = "lr-linked-social,lr-not-linked-social";
    window.lr_raas_settings.accountLinking.success = function () {
        setMessage(successMessages.AccountLinked);
    };
    window.lr_raas_settings.accountLinking.error = function (error) {
        setApiMessage(error);
    };

    window.lr_raas_settings.accountUnlinking = {};
    window.lr_raas_settings.accountUnlinking.success = function () {
        setMessage(successMessages.AccountUnlinked);
    };
    window.lr_raas_settings.accountUnlinking.error = function (error) {
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

    window.lr_raas_settings.deleteUser = {};
    window.lr_raas_settings.deleteUser.success = function (response) {
        setMessage(successMessages.DeleteVerification);
        //showLogin();
    };
    window.lr_raas_settings.deleteUser.error = function (errors) {
        if (!errors[0].rule)
            setMessage(errors[0].Description, true);
    };

    window.lr_raas_settings.deleteUserConfirm = {};
    window.lr_raas_settings.deleteUserConfirm.success = function (response) {
        setMessage(successMessages.AccountDeleted);
        window.setTimeout(function () {
            window.location = "auth.aspx";
        }, 2000);
        showLogin();
    };
    window.lr_raas_settings.deleteUserConfirm.error = function (errors) {
        if (!errors[0].rule)
            setMessage(errors[0].Description, true);
    };

    window.lr_raas_settings.israas = function (israas) {

        if (israas) {
            $("#lr-change-password > div.lr-more-info-heading > h2").text("Change Password");
        } else {
            $("#lr-change-password > div.lr-more-info-heading > h2").text("Set Password");
        }

    };


    window.lr_raas_settings.changePassword = {};
    window.lr_raas_settings.changePassword.containerid = "change-password";
    window.lr_raas_settings.changePassword.succes = function () {
        setApiMessage(apiResponse, successMessages.PaswordChanged);
    };
    window.lr_raas_settings.changePassword.error = function (error) {
        setApiMessage(error);
        visibleLoadingSpinner(false);
    };

    var deleteurl = window.location.href.replace("action=deleteuser&", "");
    raasoption.deleteUrl = raasoption.deleteUrl || encodeURIComponent(deleteurl);

    raasoption.formValidationMessage = true;
    raasoption.linkedAccountsTemplate = window.lr_raas_settings.accountLinking.linkedAccountsTemplate;
    raasoption.notLinkedAccountsTemplate = window.lr_raas_settings.accountLinking.notLinkedAccountsTemplate;
    raasoption.hashTemplate = true;
    raasoption.callbackUrl = window.location;
    var LRObject = new LoginRadiusV2(raasoption);
    LRObject.registrationFormSchema = [{ "type": "string", "name": "firstname", "display": "First Name", "rules": "", "options": null, "permission": "r" }, { "type": "string", "name": "lastname", "display": "Last Name", "rules": "", "options": null, "permission": "r" }, { "type": "string", "name": "emailid", "display": "Email Id", "rules": "required|valid_email", "options": null, "permission": "r" }, { "type": "password", "name": "password", "display": "Password", "rules": "required|min_length[6]|max_length[32]", "options": null, "permission": "r" }, { "type": "password", "name": "confirmpassword", "display": "Confirm Password", "rules": "required|min_length[6]|max_length[32]|matches[password]", "options": null, "permission": "r" }];
    for (var i = 0; i < LRObject.registrationFormSchema.length; i++) {
        if (LRObject.registrationFormSchema[i].name == "birthdate") {
            showBirthdateDatePicker();
        }
    }
    LRObject.$hooks.register('renderProfileEditorHook', function (profile, viewerSchema) {
        //var  profile=params[0];
        //var viewerSchema = params[1];

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
            renderedHtml += LRObject.util.hashTmpl("profileViewTemplate", viewerSchema[i]);
        }
        $("#profile-viewer").html(renderedHtml);
        visibleLoadingSpinner(false);
    }
    );




    LRObject.$hooks.register('startProcess', function () {
        visibleLoadingSpinner(true);
    }
    );

    LRObject.$hooks.register('endProcess', function () {
        visibleLoadingSpinner(false);
    }
    );
    function setApiMessage(apiResponse, message) {
        if (Object.keys(apiResponse).length !== 0) {
            for (var i = 0; i < apiResponse.length; i++) {
                if (apiResponse[i].ErrorCode) {
                    jQuery("#lr-raas-message").show().removeClass("loginradius-raas-success-message").addClass("loginradius-raas-error-message").text(apiResponse[i].Description).delay(10000).fadeOut(300);

                }
            }
        }
        else {
            if (apiResponse.ErrorCode) {
                jQuery("#lr-raas-message").show().removeClass("loginradius-raas-success-message").addClass("loginradius-raas-error-message").text(apiResponse.Description).delay(10000).fadeOut(300);
            } else {
                jQuery("#lr-raas-message").show().removeClass("loginradius-raas-error-message").addClass("loginradius-raas-success-message").text(message).delay(10000).fadeOut(300);
            }
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
            case "resetpassword":
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

