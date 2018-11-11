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
function initGame() {
    var cfg = {
        draggable: true,
        position: 'start',
        onDrop: handleMove,
    };

    var board = new ChessBoard('gameBoard', cfg);
    var game = new Chess();
    
}

function handleMove(source, target) {
    var move = game.move({from: source, to: target});
}

$(document).ready(function() {
    initGame();
});