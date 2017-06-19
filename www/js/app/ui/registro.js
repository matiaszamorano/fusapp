comunidadfusa.ui.registro = (function () {

    function init() {
        initForm();
    }

    function initForm() {
        $("#registro").on("submit", "#form_registro", function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $(this);
            var email = $form.find("#form_email").val().trim();
            var clave = $form.find("#form_clave").val().trim();
            var claveBis = $form.find("#form_clave_bis").val().trim();
            var apodo = $form.find("#form_apodo").val();
            if ((email === "") || (clave === "") || (apodo === "")) {
                mostrarError("Todos los campos son obligatorios");
                return;
            }

            if (clave != claveBis) {
                mostrarError("Las claves deben coincidir");
                return;
            }
            var url = comunidadfusa.service.baseURI + "/app/registro";
            var data = {
                "email": email,
                "clave": clave,
                "apodo": apodo,
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
            comunidadfusa.util.analytics.trackEvent("error", "registro", mensaje, 1);
        }, "Error");
    }

    return {
        init: init
    };

})();