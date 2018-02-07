module.exports = () => {
    // ================================================================================================ //
    // ============= Simple Clear Form Handler ======================================================== //
    // ================================================================================================ // 

    $("#clear_form").on("click", function (e) {
        e.preventDefault();
        $("#form")[0].reset();
    });

    // =============================================================================================== //
    // ============================= Toggle Menu Options Chevron ===================================== //
    // =============================================================================================== //
    $('#more_options').on('shown.bs.collapse', function () {
        $(".more_options").removeClass("glyphicon-menu-down").addClass("glyphicon-menu-up");
    });

    $('#more_options').on('hidden.bs.collapse', function () {
        $(".more_options").removeClass("glyphicon-menu-up").addClass("glyphicon-menu-down");
    });

    // ================================================================================================== //
    // Remove input 'require'. not necessary for bubble charts
    let chType = $("#chart_type").val();
    if (chType === 'bubble') {
        $("#chart_labels").attr("required", false);
    }

};