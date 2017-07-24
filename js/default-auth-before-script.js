var successMessages = {
    Register: "Email for verification has been sent to your provided email id, check email for further instructions",
    SocialLogin: "Email for verification has been sent to your provided email id, check email for further instructions",
    PasswordReset: "Password reset successfully, now you can login",
    PasswordForgot: "Password reset information sent to your provided email id, check email for further instructions",
    EmailVerify: "Email verified, now you can login"
};

var lr_raas_settings = window.lr_raas_settings || {};

lr_raas_settings.registration = {};
lr_raas_settings.registration.containerid = "registration-container";
lr_raas_settings.registration.success = function (response) {
    if (queryString.return_url) {
        registrationSuccess('register');
    } else {
        setMessage(successMessages.Register);
        resetForm('loginradius-raas-registration');
    }
};
lr_raas_settings.registration.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};


for (var i = 0; i < LoginRadiusRaaS.RegistrationFormSchema.length; i++) {
    if (LoginRadiusRaaS.RegistrationFormSchema[i].name == "birthdate") {
        showBirthdateDatePicker();
    }
}


lr_raas_settings.login = {};
lr_raas_settings.login.containerid = "login-container";
lr_raas_settings.login.success = function (response) {
    redirectToReturnUrl(response.access_token);
};
lr_raas_settings.login.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};


lr_raas_settings.sociallogin = {};
lr_raas_settings.sociallogin.containerid = "sociallogin-container";
lr_raas_settings.sociallogin.interfaceid = "interfacecontainerdiv";
lr_raas_settings.sociallogin.templateid = "loginradiuscustom_tmpl";
lr_raas_settings.sociallogin.success = function (response) {
    if (response.isPosted) {
        if (queryString.return_url) {
            registrationSuccess('register');
        } else {
            setMessage(successMessages.SocialLogin);
            resetForm('loginradius-raas-registration');
            showLogin();
        }
    } else {
        redirectToReturnUrl(response);
    }
};
lr_raas_settings.sociallogin.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};


lr_raas_settings.resetpassword = {};
lr_raas_settings.resetpassword.containerid = "resetpassword-container";
lr_raas_settings.resetpassword.success = function (response) {

    setMessage(successMessages.PasswordReset);
    showLogin();
};
lr_raas_settings.resetpassword.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};
if (window.location.search.indexOf('vtoken') > -1 && window.location.search.indexOf('vtype=reset') > -1) {
    $("#lr-social-login,#lr-traditional-login").hide();
    $("#resetpassword-container,#lr-raas-resetpassword").show();
}



lr_raas_settings.forgotpassword = {};
lr_raas_settings.forgotpassword.containerid = "forgotpassword-container";
lr_raas_settings.forgotpassword.success = function (response) {
    if (queryString.return_url) {
        registrationSuccess('forgotpassword');
    } else {
        setMessage(successMessages.PasswordForgot);
        resetForm('loginradius-raas-forgotpassword');
    }
};
lr_raas_settings.forgotpassword.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};


lr_raas_settings.emailverification = {};
lr_raas_settings.emailverification.success = function (response) {
    if (response.access_token) {
        redirectToReturnUrl(response.access_token);
    } else {
        setMessage(successMessages.EmailVerify);
    }
};
lr_raas_settings.emailverification.error = function (errors) {
    if (!errors[0].rule)
        setMessage(errors[0].message, true);
};

LoginRadiusRaaS.$hooks.setProcessHook(function () {
    visibleLoadingSpinner(true);
}, function () {
    visibleLoadingSpinner(false);
});


LoginRadiusRaaS.$hooks.socialLogin.onFormRender = function () {
    $("#lr-traditional-login,#lr-raas-registartion,#resetpassword-container,#lr-social-login,#interfacecontainerdivn").hide();
    $("#lr-raas-sociallogin").show();

};

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



