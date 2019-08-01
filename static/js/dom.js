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
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
            dom.renameBoard();
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



        for(let board of boards){
            let clone = document.importNode(boardTemplate.content, true);
            let title = clone.querySelector('.board-title');
            title.setAttribute('data-board-id',board.id);
            clone.querySelector('.board').id = `board${board.id}`;
            clone.querySelector('.board').setAttribute('data-id', `${board.id}`);
            title.innerHTML = `${board.title}`;
            container.appendChild(clone);
        }

    },

    createBoard: function() {

        let button = document.getElementById('new-board');
        let boardName = document.getElementById('board-name');
        button.addEventListener('click',()=>{
            let title = boardName.value;
            dataHandler.createNewBoard(`${title}`, () =>{
                boardName.value = "";
                this.loadBoards()
            })

        })

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, this.showCards)
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    renameBoard: function () {
        const boards = document.querySelector('.board-container');
        if (boards === null) {
                console.log('no boards found');
            return; }
        console.log(boards.children.length);
        for(let board of boards.children)
        {
            const renameBtn = board.querySelector('.board-title');
            if(renameBtn === null){
                console.log('no span found');
            }
            renameBtn.addEventListener('click', function (event) {
                const boardTitle = event.target;
                let titleText = boardTitle.textContent;
                let inputField = document.createElement('input');
                inputField.setAttribute('type','text');
                inputField.setAttribute('value', titleText);
                boardTitle.innerHTML = '';
                boardTitle.appendChild(inputField);
                inputField.addEventListener('keydown', function (event) {
                        if(event.key === "Enter")
                        {
                            let boardId = boardTitle.dataset.boardId;
                            let newTitle = event.target.value;
                            console.log(`id: ${boardId}, title: ${newTitle}`);
                            dataHandler.renameBoard(boardId,newTitle,dom.loadBoards);
                        }
                    }
                )
            })
        }
    },
    // here comes more features
    toggleBoard: function() {
        let boards = document.getElementsByClassName('board');
        let template = document.getElementById('board-columns');


        for (let board of boards) {
            let toggle = board.querySelector('.board-toggle');
            let toggleImage = toggle.querySelector('i');
            toggle.addEventListener('click',  function () {
                let clone = document.importNode(template.content, true);


                dataHandler.getStatuses(board.dataset.id, function (statusData) {
                    const statusId = statusData.id;
                    const statusTitle = statusData.title;
                    const statusIdDom = clone.querySelector('.board-column-content');
                    statusIdDom.setAttribute('data-status-id', `${statusId}`);
                    const statusTitleDom = clone.querySelector('.board-column-title');
                    statusTitleDom.textContent = statusTitle;
                });


                if (toggleImage.className === "fas fa-chevron-down"){
                    board.appendChild(clone);
                    toggleImage.className = "fas fa-chevron-up"
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
