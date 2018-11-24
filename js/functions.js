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
var FLAGS = {
    NORMAL: 'n',
    CAPTURE: 'c',
    BIG_PAWN: 'b',
    EP_CAPTURE: 'e',
    PROMOTION: 'p',
    KSIDE_CASTLE: 'k',
    QSIDE_CASTLE: 'q',
    EXPLOSION: 'x',
    ABSORPTION: 'a',
    KICK: 'y'
};

function initGame() {
    var board,
        game = new Chess(),
        statusEl = $('#status'),
        fenEl = $('#fen'),
        pgnEl = $('#pgn');
    explosiveCheckbox = $('#explosiveCheckbox');
    normalCheckbox = $('#normalCheckbox');
    queenExplosion = $("[name='queenExplosion']");
    var removeColorSquares = function() {
        $('#board .square-55d63').css('background', '');
        $('#board').css('border', '25px solid white');
    };

    var greySquare = function(square) {
        var squareEl = $('#board .square-' + square);

        var background = '#a9a9a9';
        if (squareEl.hasClass('black-3c85d') === true) {
            background = '#696969';
        }

        squareEl.css('background', background);
    };

    var redSquare = function(square) {
        var squareEl = $('#board .square-' + square);

        var background = '#ff0000';
        if (squareEl.hasClass('black-3c85d') === true) {
            background = '#ff2200';
        }

        squareEl.css('background', background);
    };
    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function(source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    var onDrop = function(source, target) {
        removeColorSquares();
        if (normalCheckbox.is(':checked') && explosiveCheckbox.is(':checked')) var legal = "all";
        else if (normalCheckbox.is(':checked')) var legal = "normal";
        else if (explosiveCheckbox.is(':checked')) var legal = "explosive";
        else return;




        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        }, { legal: legal });

        // illegal move
        if (move === null) return 'snapback';
        //if (!(explosiveCheckbox.is(':checked')) && [FLAGS.EXPLOSION, FLAGS.ABSORPTION, FLAGS.KICK].indexOf(move.flags) !== -1) return 'snapback';
        //if (!(normalCheckbox.is(':checked')) && [FLAGS.EXPLOSION, FLAGS.ABSORPTION, FLAGS.KICK].indexOf(move.flags) === -1) return 'snapback';

        updateStatus();
        if (move && target === "offboard") return 'trash';
    };

    // update the board position after the piece snap 
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        board.position(game.fen());
    };
    var onMouseoverSquare = function(square, piece) {
        if (normalCheckbox.is(':checked') && explosiveCheckbox.is(':checked')) var legal = "all";
        else if (normalCheckbox.is(':checked')) var legal = "normal";
        else if (explosiveCheckbox.is(':checked')) var legal = "explosive";
        else return;
        // get list of possible moves for this square
        var moves = game.moves({
            square: square,
            verbose: true,
            legal: legal
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;


        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            if ([FLAGS.EXPLOSION, FLAGS.ABSORPTION, FLAGS.KICK].indexOf(moves[i].flags) === -1 && normalCheckbox.is(':checked')) {
                greySquare(moves[i].to);
            }

            if ([FLAGS.EXPLOSION, FLAGS.ABSORPTION, FLAGS.KICK].indexOf(moves[i].flags) !== -1 && explosiveCheckbox.is(':checked')) {
                if (moves[i].to === "offboard") $('#board').css('border', '25px solid red');
                else redSquare(moves[i].to);
            }
        }
    };

    var onMouseoutSquare = function(square, piece) {
        removeColorSquares();
    };
    var updateStatus = function() {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
    };

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onMouseoutSquare: onMouseoutSquare,
        onMouseoverSquare: onMouseoverSquare,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);

    updateStatus();

}

function handleMove(source, target) {
    var move = game.move({ from: source, to: target });
}

$(document).ready(function() {
    initGame();
});