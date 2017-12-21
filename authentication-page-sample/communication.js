 var _queryString = window.location.search.replace("?", "");

 var successMessages = {
    Register: "A verification email has been sent to your provided email address, please check your email for further instructions",
    SocialLogin: "A verification email has been sent to your provided email address, please check your email for further instructions",
    PasswordReset: "Password was reset successfully",
    PasswordForgot: "A verification email has been sent to your provided email address, please check your email for further instructions",
    EmailVerify: "Email verification complete, now you may log in",
    InstantLink: "Instant Link For Login has been sent to your provided email id, check email for further instruction",
    ResendOTP: "OTP has been sent to your provided phone number. "

 };

 /* show calender */
 function showBirthdateDatePicker() {
    var maxYear = new Date().getFullYear();
    var minYear = maxYear - 100;
    $('body').on('focus', ".loginradius-birthdate", function() {
        $('.loginradius-birthdate').datepicker({
            dateFormat: 'mm-dd-yy',
            maxDate: new Date(),
            minDate: "-100y",
            changeMonth: true,
            changeYear: true,
            yearRange: (minYear + ":" + maxYear)
        });
    });
 }

 


 /* Send Post Message */

 function lrPostMessage(action, status, data) {
  
    var message = {
        'data': {
            'action': action,
            'status': status,
            'data': data
        }
    };
    parent.postMessage(JSON.stringify(message), "*");

 }

 /* fetching custom action to pass on runtime */
 custom_action = "undefined";
 $(document).ready(function() {

    if ($("#registration-container").is(':visible')) {

        custom_action = 'register';

    } else if ($("#login-container").is(':visible')) {
        custom_action = 'login';

    } else if ($("#forgotpassword-container").is(':visible')) {
        custom_action = 'forgotpassword';
    } else if ($("#forgotpassword-container").is(':visible')) {
        custom_action = 'forgotpassword';
    } else if ($("#resetpassword-container").is(':visible')) {
        custom_action = 'resetpassword';
    }


 });

 if (self == top) { /* no iframe detected */
    iframe = false;
 } else { /* iframe detected */
    iframe = true
 }


 var lr_raas_settings = window.lr_raas_settings || {};

 /* EMAIL VERIFICATION */
  console.log(lr_raas_settings);

lr_raas_settings.emailverification = {};

 lr_raas_settings.emailverification.success = function(response) { 
    
    setMessage(successMessages.EmailVerify);
    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);

    } else { 

        if (response.access_token) {
            setMessage(successMessages.EmailVerify);
            redirectToReturnUrl(response.access_token);
        }



    }


 };
 
 lr_raas_settings.emailverification.error = function(errors) { 
    
    if (iframe == true) {
    /* callback object for eventlistner */
    return lrPostMessage(custom_action, 'error', errors);
    }

    if (!errors[0].rule)
        setMessage(errors[0].Message, true);

 };


 /* REGISTER */
 lr_raas_settings.registration = {};
 lr_raas_settings.registration.containerid = "registration-container";
 lr_raas_settings.registration.success = function(response) {

    if (iframe == true) {
        setMessage(successMessages.Register);
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);

    }

    lr_raas_settings.login.success(response, 'register');

 };
 lr_raas_settings.registration.error = function(errors) {

    if(iframe == true){
        /* callback object for eventlistner */
    return lrPostMessage(custom_action, 'error', errors);
    }
    if (!errors[0].rule)
        setMessage(errors[0].Message, true);

 };

 /* LOGIN */
 lr_raas_settings.login = {};
 lr_raas_settings.login.containerid = "login-container";
 lr_raas_settings.login.success = function(response, flag) {

    if (iframe == true) {

        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);


    } else {
        if (response.access_token) {
            redirectToReturnUrl(response.access_token);
        } else {
            if (response.AccountSid || (response.IsPosted && response.Data && response.Data.AccountSid)) {
                setMessage(successMessages.ResendOTP);
            } else if (_queryString.indexOf('return_url') != -1) {
                registrationSuccess('register');
            } else {
                if (flag == 'register') {
                    setMessage(successMessages.Register);
                    resetForm('loginradius-registration');
                } else {
                    setMessage(successMessages.InstantLink);
                    resetForm('loginradius-login');
                }
            }
        }
    }
 };
 lr_raas_settings.login.error = function(errors) {
    
    if (iframe == true) {
    /* callback object for eventlistner */
    return lrPostMessage(custom_action, 'error', errors);
    }


    if (!errors[0].rule)
        setMessage(errors[0].Description, true);

 };




 /* SOCIAL */
 lr_raas_settings.sociallogin = {};
 lr_raas_settings.sociallogin.interfaceclass = ".interfacecontainerdiv";
 lr_raas_settings.sociallogin.containerid = "sociallogin-container";
 lr_raas_settings.sociallogin.interfaceid = "interfacecontainerdiv";
 lr_raas_settings.sociallogin.templateid = "loginradiuscustom_tmpl";

 lr_raas_settings.sociallogin.success = function(response, data) {

    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);

    } else {

        if (response.IsPosted) {
            if (_queryString.indexOf('return_url') != -1) {
                registrationSuccess('register');
            } else {
                setMessage(successMessages.SocialLogin);
                resetForm('loginradius-registration');
                showLogin();
            }
        } else {
            redirectToReturnUrl(response.access_token);
        }
    }
 };
 lr_raas_settings.sociallogin.error = function(errors) {

    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'error', errors);

    } else {

        if (!errors[0].rule)
            setMessage(errors[0].Message, true);
    }
 };

 /* INSTALINK */
 lr_raas_settings.instantlinklogin = {};
 lr_raas_settings.instantlinklogin.success = function(response) {
    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);

    } else {
        redirectToReturnUrl(response.access_token);
    }

 };
 lr_raas_settings.instantlinklogin.error = function(errors) {
    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'error', errors);

    } else {

        /* callback object for eventlistner */
        return lrPostMessage(custom_action, errors);


        if (!errors[0].rule)
            setMessage(errors[0].Message, true);
    }
 };

 /* RESET PASSWORD */
 lr_raas_settings.resetpassword = {};
 lr_raas_settings.resetpassword.containerid = "resetpassword-container";
 lr_raas_settings.resetpassword.success = function(response) {
    setMessage(successMessages.PasswordReset);
    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'success', response);



    } else {

        showLogin();
    }
 };
 lr_raas_settings.resetpassword.error = function(errors) {
     
     if (iframe == true) {
      /* callback object for eventlistner */
      return lrPostMessage(custom_action, 'error', errors);
    }

    if (!errors[0].rule)
        setMessage(errors[0].Description, true);


 };
 if (window.location.search.indexOf('vtoken') > -1 && window.location.search.indexOf('vtype=reset') > -1) {
    $("#lr-social-login,#lr-traditional-login").hide();
    $("#resetpassword-container,#lr-raas-resetpassword").show();
 }


 /* FORGOT PASSWORD */
 lr_raas_settings.forgotpassword = {};
 lr_raas_settings.forgotpassword.containerid = "forgotpassword-container";
 lr_raas_settings.forgotpassword.success = function(response) {

    if (iframe == true) {
        /* callback object for eventlistner */
        setMessage(successMessages.PasswordForgot);
        return lrPostMessage(custom_action, 'success', response);

    } else {
        if (response.IsPosted && response.Data && response.Data.AccountSid) {
            setMessage(successMessages.ResendOTP);
        } else if (_queryString.indexOf('return_url') != -1) {
            registrationSuccess('forgotpassword');
        } else {
            if (raasoption.phoneLogin) {
                setMessage(successMessages.PasswordReset);
                showLogin();
            } else {
                setMessage(successMessages.PasswordForgot);
                resetForm('loginradius-forgotpassword');
            }
        }
    }
 };
 lr_raas_settings.forgotpassword.error = function(errors) {
    if (iframe == true) {
        /* callback object for eventlistner */
        return lrPostMessage(custom_action, 'error', errors);

    } else {
        if (!errors[0].rule)
            setMessage(errors[0].Message, true);
    }
 };

 
 raasoption.formValidationMessage = true;
 /* getting current url form the parent window. */
 var currentUrl = document.referrer;

 if (iframe) {
    var forgotpasswordurl = currentUrl;
    var emailverifyurl = currentUrl;
 } else {
    var forgotpasswordurl = window.location.href.replace("action=forgotpassword&", "").replace("action=login&", "");
    var emailverifyurl = window.location.href.replace("action=register&", "");
 }


 raasoption.forgotPasswordUrl = raasoption.forgotPasswordUrl || encodeURIComponent(forgotpasswordurl);
 raasoption.verificationUrl = raasoption.verificationUrl || encodeURIComponent(emailverifyurl);

 raasoption.hashTemplate = true;
 raasoption.callbackUrl = window.location.href.split('?')[0];

 /* common options to return jwt response */
 raasoption.tokenType = 'jwt';
 raasoption.integrationName = ''; /* your jwt app name */
 
 var LRObject = new LoginRadiusV2(raasoption);

 LRObject.registrationFormSchema = raasoption.registrationFormSchema;
 var queryString = LRObject.util.parseQueryString(window.location.search.replace("?", ""));

 for (var i = 0; i < LRObject.registrationFormSchema.length; i++) {
    if (LRObject.registrationFormSchema[i].name == "birthdate") {
        showBirthdateDatePicker();
    }
 }

 LRObject.$hooks.register('startProcess', function() {
    visibleLoadingSpinner(true);
 });
 LRObject.$hooks.register('endProcess', function() {
    visibleLoadingSpinner(false);
 });

 LRObject.$hooks.register('socialLoginFormRender', function() {
    /* on social login form render */
    $("#lr-traditional-login,#lr-raas-registartion,#resetpassword-container,#lr-social-login,#interfacecontainerdivn").hide();
    $("#lr-raas-sociallogin").show();
 });


 if (queryString.action === "register") {
    showRegister();
 } else if (queryString.action === "login") {
    showLogin();
 } else if (queryString.action === "forgotpassword") {
    showForgotPassword();
 }


 jQuery(".lr-raas-forgot-password").click(showForgotPassword);
 jQuery(".lr-raas-login-link").click(showLogin);
 jQuery(".lr-register-link").click(showRegister);

 function showForgotPassword() {
    $("#lr-traditional-login,#lr-raas-registartion,#resetpassword-container,#lr-social-login,#lr-raas-resetpassword").hide();
    $("#lr-raas-forgotpassword").show();
 }

 function showLogin() {
    $("#lr-social-login,#lr-traditional-login").show();
    $("#lr-raas-registartion,#lr-raas-forgotpassword,#resetpassword-container,#lr-raas-sociallogin,#lr-raas-resetpassword").hide();
 }

 function showRegister() {
    $("#lr-traditional-login,#lr-raas-forgotpassword,#resetpassword-container,#lr-raas-sociallogin,#lr-raas-resetpassword").hide();
    $("#lr-social-login,#lr-raas-registartion").show();
 }

 function setMessage(msg, isError) {
    if (isError) {
        jQuery("#lr-raas-message").show().removeClass("loginradius-raas-success-message").addClass("loginradius-raas-error-message").text(msg).delay(10000).fadeOut(300);
    } else {
        jQuery("#lr-raas-message").show().removeClass("loginradius-raas-error-message").addClass("loginradius-raas-success-message").text(msg).delay(10000).fadeOut(300);
    }

    visibleLoadingSpinner(false);
 }

 function redirectToReturnUrl(token) {

    if (queryString.return_url) {
        window.location = queryString.return_url.indexOf('?') > -1 ? queryString.return_url + '&token=' + token : queryString.return_url + '?token=' + token;
    } else {
        window.location = 'profile.aspx';
    }
 }

 function resetForm(formname) {
    clearForm(document.getElementsByName(formname)[0]);
 }


 function registrationSuccess(action) {

    window.location = queryString.return_url.indexOf('?') > -1 ? queryString.return_url + '&action_completed=' + action : queryString.return_url + '?action_completed=' + action;
 }


 function visibleLoadingSpinner(isvisible) {
    if (isvisible) {
        $("#loading-spinner").show();
    } else {
        $("#loading-spinner").hide();
    }
 }


 function clearForm(myFormElement) {

    var elements = myFormElement.elements;

    myFormElement.reset();

    for (i = 0; i < elements.length; i++) {

        field_type = elements[i].type.toLowerCase();

        switch (field_type) {

            case "text":
            case "password":
            case "textarea":
                elements[i].value = "";
                break;

            case "radio":
            case "checkbox":
                if (elements[i].checked) {
                    elements[i].checked = false;
                }
                break;

            case "select-one":
            case "select-multi":
                elements[i].selectedIndex = -1;
                break;

            default:
                break;
        }
    }
 }