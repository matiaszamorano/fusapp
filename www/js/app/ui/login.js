comunidadfusa.ui.login = (function () {

    function init() {
        initForm();
        initFacebookLogin();
        $(".fusa-js-desplegar-menu").remove();
        $(".fusa-js-menu-usuario").remove();
        $(".fusa-js-buscar").remove();
        $("footer").remove();
        $("a.navbar-brand").attr("href", "#");
        $("a.navbar-brand").removeAttr("rel");
    }

    function initFacebookLogin() {
        $(document).on("click", "#fusa-fb-login", loginConFacebook);
    }

    function loginConFacebook() {
        comunidadfusa.ui.mostrarCargando();
        facebookConnectPlugin.login(["email", "public_profile"], facebookLoginSuccess, facebookLoginError);
        return false;
    }

    function facebookLoginSuccess() {
        $('#splash').show();
        facebookConnectPlugin.api("/v2.9/me?fields=id,name,email,gender,cover,picture", ["email", "public_profile"], function (response) {
            var data = {
                "email": response.email,
                "apodo": response.name
            };
            var url = comunidadfusa.service.baseURI + "/app/facebook/registro";

            comunidadfusa.service.post(url, data)
                    .done(function (data) {
                        comunidadfusa.service.usuario.set(data["usuario"]);
                        window.location = "index.html";
                    })
                    .fail(function (error) {
                        mostrarError(error.responseJSON.error);
                    });
        }, facebookLoginError);
    }

    function facebookLoginError(error) {
        console.log(error);
        comunidadfusa.ui.ocultarCargando();
    }

    function initForm() {
        $("#login").on("submit", "#form_login", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $(this);
            var email = $form.find("#form_email").val().trim();
            var clave = $form.find("#form_clave").val().trim();
            if ((email === "") || (clave === "")) {
                mostrarError("Ingresa un email y clave");
                return;
            }
            var url = comunidadfusa.service.baseURI + "/app/login";
            var data = {
                "email": email,
                "clave": clave,
                "mobile": true
            };

            comunidadfusa.service.post(url, data)
                    .done(function (data) {
                        comunidadfusa.service.usuario.set(data["usuario"]);
                        window.location = "index.html";
                    })
                    .fail(function (error) {
                        $("#spin").addClass("hide");
                        mostrarError(error.responseJSON.error);
                    });
            $("#spin").removeClass("hide");
        });
    }


    function mostrarError(mensaje) {
        navigator.notification.alert(mensaje, function () {
            comunidadfusa.util.analytics.trackEvent("error", "login", mensaje, 1);
        }, "Error");
    }

    function getUsuario() {
        return usuario;
    }

    return {
        init: init,
        getUsuario: getUsuario
    };

})();