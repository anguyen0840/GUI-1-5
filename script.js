/* 
File: script.js
GUI Assignment 5 : Scrabble
Anh Nguyen, UMass Lowell Computer Science, anh_nguyen9@student.uml.edu
Copyright (c) 2025 by Anh Nguyen. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by AN on June 27, 2025 at 12:15 PM 
July 4, 2025 at 2 PM */

$(function() {
    const letterDistribution = {
        'A': 9, 'B': 2, 'C': 2, 'D': 4, 'E': 12, 'F': 2, 'G': 3, 'H': 2,
        'I': 9, 'J': 1, 'K': 1, 'L': 4, 'M': 2, 'N': 6, 'O': 8, 'P': 2,
        'Q': 1, 'R': 6, 'S': 4, 'T': 6, 'U': 4, 'V': 2, 'W': 2, 'X': 1,
        'Y': 2, 'Z': 1, ' ': 2 
    };

    const letterValues = {
        'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4,
        'I': 1, 'J': 8, 'K': 5, 'L': 1, 'M': 3, 'N': 1, 'O': 1, 'P': 3,
        'Q': 10, 'R': 1, 'S': 1, 'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8,
        'Y': 4, 'Z': 10, ' ': 0 
    };

    const bonuses = [0, 0, 2, 0, 0, 0, 2, 0, 2, 0, 0, 0, 2, 0, 0]; 

    let score = 0;
    
    function createTiles() {
        const rack = $('#tileHolder');
        rack.empty();

        for (let i = 0; i < 7; i++) {
            const randomLetter = getRandomLetter();
            const tile = createTile(randomLetter); 
            tile.draggable({
                revert: "invalid",
                containment: 'body',
                stack: ".tile"
            });
            rack.append(tile);
        }
    }

    function createTile(letter) {
        const tile = $('<div class="tile"></div>').data('letter', letter);
        const backgroundImage = `url('graphics/Scrabble_Tiles/Scrabble_Tile_${letter.toUpperCase()}.jpg')`;
        tile.css('background-image', backgroundImage);
        return tile;
    }

    function getRandomLetter() {
        const letters = Object.keys(letterDistribution);
        let letter;
        do {
            letter = letters[Math.floor(Math.random() * letters.length)];
        } while (letterDistribution[letter] === 0);
        
        letterDistribution[letter]--;
        
        return letter;
    }

    function createBoard() {
        const board = $('#board');
        board.empty();
    
        for (let i = 0; i < 15; i++) {
            const cell = $('<div class="tileSlot"></div>').css({
                left: `${i * 70}px`,
                top: '0px'
            });

            if (bonuses[i] > 0) {
                cell.css('border-color', 'red');
            }
            
            cell.droppable({
                accept: ".tile",
                drop: function(event, ui) {
                    const letter = ui.helper.data('letter');
                    const droppedTile = ui.helper;

                    droppedTile.detach().css({
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        position: 'absolute'
                    });

                    $(this).append(droppedTile);
                    $(this).data('letter', letter);
                    $(this).droppable('disable');
                    
                    calculateScore();
                }
            });

            board.append(cell);
            
        }
    }

    function calculateScore() {
        score = 0;

        $('.tileSlot').each(function (index) {
            const letter = $(this).data('letter');

            if (letter) {
                const letterScore = letterValues[letter.toUpperCase()];
                if (bonuses[index] > 0) {
                    score += letterScore * bonuses[index];
                } else {
                    score += letterScore;
                }
            }
        });

        $('#scoreDisplay').text(`Score: ${score}`);
    }
    
    function clearBoard() {
        $('.tileSlot').each(function() {
            const letter = $(this).data('letter');
            const tile = $(this).find('.tile');
            if (tile.length) {
                 $('#tileHolder').append(tile.css({
                    position: 'relative',
                    top: '',
                    left: '',
                    width: '',
                    height: ''
                }));
            }
            $(this).data('letter', null).empty().droppable('enable');
        });
    }

    function drawNewTiles() {
        clearBoard();
        createTiles();
    }

    $('#drawButton').click(drawNewTiles);
    $('#calculateScore').click(calculateScore);

    createTiles();
    createBoard();
});