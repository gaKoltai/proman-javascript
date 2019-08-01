// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prepend(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        this.createBoard();
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            dom.toggleBoard();
            dom.deleteBoard();
        });



    },


    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardTemplate = document.getElementById('board-template');
        let container = document.querySelector('.board-container');
        container.innerHTML = "";

        for (let board of boards) {
            let clone = document.importNode(boardTemplate.content, true);
            let title = clone.querySelector('.board-title');
            clone.querySelector('.board').id = `${board.id}`;
            clone.querySelector('.board').setAttribute('data-id', `${board.id}`);

            title.innerHTML = `${board.title}`;
            container.appendChild(clone);
        }
    },

    createBoard: function () {

        let button = document.getElementById('new-board');
        let boardName = document.getElementById('board-name');
        button.addEventListener('click', () => {
            let title = boardName.value;
            dataHandler.createNewBoard(`${title}`, () => {
                boardName.value = "";
                this.loadBoards()
            })

        })

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called

        dataHandler.getCardsByBoardId(boardId, dom.showCards)
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        console.log(cards);
        let cardTemplate = document.querySelector('#card-template');

        for (let card of cards) {

            let clone = document.importNode(cardTemplate.content, true);
            console.log(card.board_id);
            let columnToPopulate = document.getElementById(`${card.board_id}`).getElementsByClassName(`${card.status_id}`)[0];

            let title = clone.querySelector('.card-title');
            title.textContent = `${card.title}`;
            columnToPopulate.appendChild(clone);

        }



    },


    toggleBoard: function() {
        let boards = document.getElementsByClassName('board');
        let template = document.getElementById('board-columns');


        for (let board of boards) {
            let toggle = board.querySelector('.board-toggle');
            let toggleImage = toggle.querySelector('i');
            toggle.addEventListener('click',  function () {
                let clone = document.importNode(template.content, true);

                if (toggleImage.className === "fas fa-chevron-down"){
                    board.appendChild(clone);
                    toggleImage.className = "fas fa-chevron-up";
                    dom.loadCards(`${board.dataset.id}`) //loads just a sample, integrate into event listener for dropdown
                } else {
                    toggleImage.className = "fas fa-chevron-down";
                    board.removeChild(board.children[1]);
                }
            })
        }
    },

    /* DELETES ONLY BOARD (no cards - yet) */

    deleteBoard: function() {
        let boards = document.getElementsByClassName('board');

        for (let board of boards) {
            let _delete = board.querySelector('.board-delete');
            _delete.addEventListener('click', function(){
                dataHandler.deleteBoard(`${board.dataset.id}`, function() {
                    dom.loadBoards();
                })
            })
        }
    }
};
