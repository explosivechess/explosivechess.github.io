function showDropdown() {
    $("#myDropdown").toggleClass("show");
}

window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
        var myDropdown = $("#myDropdown");
        if (myDropdown.hasClass('show')) {
            myDropdown.removeClass('show');
        }
    }
}
