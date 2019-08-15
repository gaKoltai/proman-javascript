// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";
import {listeners} from "./event_listeners.js";

export let dom = {

    init: function () {
        this.toggleCreateBoard();
        this.createBoard();
        this.toggleBoard();
        this.deleteBoard();
        this.createCard();
        this.renameBoard();
        this.deleteCard();
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            dom.showColumns();
        });
    },


    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let container = document.querySelector('.board-container');
        container.innerHTML = "";

        for (let board of boards) {
            dom.showBoard(board, container)

        }

    },


    showBoard: function (board) {
        const boardTemplate = document.getElementById('board-template');
        const container = document.querySelector('.board-container');
        const clone = document.importNode(boardTemplate.content, true);
        const title = clone.querySelector('.board-title');
        clone.querySelector('.board').id = `${board.id}`;
        title.setAttribute('data-board-id', board.id);
        clone.querySelector('.board').setAttribute('data-id', `${board.id}`);

        title.innerHTML = `${board.title}`;
        container.appendChild(clone);

    },

    showColumns: function () {

        let boards = document.getElementsByClassName('board');
        let columnsTemplate = document.getElementById('board-columns');
        let columnTemplate = document.getElementById('board-column');

        boards.innerHTML = "";

        for (let board of boards) {
            dom.addColumnsToBoard(board, columnsTemplate, columnTemplate, dom.loadCards)
        }
    },


    addColumnsToBoard: function (board, columns, column, callback) {

        let columnsClone = document.importNode(columns.content, true);

        dataHandler.getStatuses(board.dataset.id, function (statusData) {
            for (let status of statusData) {
                let columnClone = document.importNode(column.content, true);

                let statusId = status.id;
                let statusTitle = status.title;

                let statusIdDom = columnClone.querySelector('.board-column-content');
                statusIdDom.setAttribute('data-status-id', statusId);

                let statusTitleDom = columnClone.querySelector('.board-column-title');
                statusTitleDom.textContent = statusTitle;

                let container = columnsClone.querySelector('div');

                container.appendChild(columnClone);
            }
            board.appendChild(columnsClone);
            callback(board.dataset.id);
        });
    },

    toggleCreateBoard: function () {

        listeners.toggleCreateBoard(function (event) {

            const inputField = document.querySelector('.new-board-input');

            if (event.target.classList.contains('fa-plus')) {
                inputField.classList.remove('invisible');
                event.target.classList.replace('fa-plus', 'fa-minus')
            } else {
                inputField.classList.add('invisible');
                event.target.classList.replace('fa-minus', 'fa-plus')
            }

        })

    },

    createBoard: function () {


        listeners.createBoard(function () {
            const inputField = document.getElementById('board-name');
            dataHandler.createNewBoard(inputField.value, function (board) {
                dom.showBoard(board);
                inputField.value = "";

            })
        });

    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called

        dataHandler.getCardsByBoardId(boardId, dom.showCards)
    },

    showCards: function (cards) {

        for (let card of cards) {
            dom.showCard(card)

        }
    },

    createCard: function () {

        listeners.createCard(function (event) {

            const board = event.target.parentElement;
            const inputField = board.querySelector('.card-create-input');
            const boardId = board.parentElement.dataset.id;

            inputField.value = "";
            inputField.classList.remove('invisible');
            event.target.classList.add('invisible');

            listeners.sendNewCardsName(function (event) {

                if (event.key === 'Enter') {
                    let newCardTitle = event.target.value;

                    dataHandler.createNewCard(newCardTitle, boardId, function (card) {
                        dom.showCard(card)
                    });

                    inputField.classList.add('invisible');
                    event.target.classList.remove('invisible');
                }
            })

        });
    },


    showCard: function (card) {

        const cardTemplate = document.querySelector('#card-template');
        const clone = document.importNode(cardTemplate.content, true);
        const columnToPopulate = document.querySelector(`[data-status-id='${card.status_id}']`);
        const title = clone.querySelector('.card-title');

        clone.querySelector('.card').setAttribute('data-card-id', `${card.id}`);
        title.textContent = `${card.title}`;
        columnToPopulate.appendChild(clone)

    },

    renameBoard: function () {


        listeners.renameBoard(function (event) {

            const boardHeader = event.target.parentElement;
            const boardId = boardHeader.parentElement.dataset.id;
            const boardTitle = event.target.textContent;
            const inputField = boardHeader.querySelector('.board-rename-input');

            inputField.classList.remove('invisible');
            inputField.value = boardTitle;
            event.target.classList.add('invisible');

            listeners.sendNewBoardName(function(event){
                if (event.key === 'Enter') {
                    dataHandler.renameBoard(boardId, inputField.value, dom.loadBoards);
                }
            })
        });
    },

    toggleBoard: function () {


        listeners.openBoard(function (event) {
            const board = event.target.parentElement.parentElement;
            const boardColumns = board.querySelector('.board-columns');

            if (event.target.classList.contains('fa-chevron-down')) {
                boardColumns.classList.remove('invisible',);
                event.target.classList.replace('fa-chevron-down', 'fa-chevron-up')
            } else {
                boardColumns.classList.add('invisible');
                event.target.classList.replace('fa-chevron-up', 'fa-chevron-down')
            }

        })
    },

    deleteBoard: function () {


        listeners.deleteBoard(function (event) {
            const boardHeader = event.target.parentElement;
            const boardId = boardHeader.querySelector('.board-title').dataset.boardId;

            dataHandler.deleteBoard(boardId, function () {
                dom.loadBoards();
            })
        })


    },


    deleteCard: function() {
        listeners.deleteCard(function (event) {

            const card = event.target.parentElement;
            const cardId = card.dataset.cardId;
            const boardId = card.parentElement.parentElement.parentElement.parentElement.dataset.id;

            dataHandler.deleteCard(cardId, function () {
                dom.loadCards(boardId)

            })



        })

    },


    renameColumn: function () {

        const boards = document.getElementsByClassName('board');


        for (let board of boards) {
            const columns = board.getElementsByClassName('board-columns');

            for (let column of columns) {

                let columnTitle = column.querySelector('board-column-title');

                columnTitle.addEventListener('click', function toggleColumnRename() {
                    let titleInput = column.querySelector('column-rename-input');
                    columnTitle.style.display = "none";
                    titleInput.style.display = "flex";

                    titleInput.addEventListener('keydown', function (event) {
                        if (event.key === "Enter") {
                            columnTitle.style.display = "flex";
                            titleInput.style.display = "none";
                            dataHandler.renameColumn(`${statusId}`, `${titleInput.value}`, function () {
                                dom.loadBoards()
                            });
                        }
                    });
                })
            }

        }


    }
};
