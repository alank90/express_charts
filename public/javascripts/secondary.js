
$(".open_help").on("click", function () {
    /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
});



/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
$(".closebtn").on("click", function () {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
});

// ===================== Event Handler for Printing Out Canvas Chart =================================== //
$("#print_chart").click(function() {
    const canvas = document.getElementById("myChart");
    window.location = canvas.toDataURL("image/png");
});