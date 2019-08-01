// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {

    init: function () {
        this.toggleCreateBoard()
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            dom.renameBoard();
            dom.deleteBoard();
            dom.createCard();
            dom.showColumns();
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
            title.setAttribute('data-board-id', board.id);
            clone.querySelector('.board').setAttribute('data-id', `${board.id}`);

            title.innerHTML = `${board.title}`;
            container.appendChild(clone);
        }

    },

    showColumns: function () {
        let boards = document.getElementsByClassName('board');
        let columnsTemplate = document.getElementById('board-columns');
        let columnTemplate = document.getElementById('board-column');

        boards.innerHTML = "";

        for (let board of boards) {

            let columnsClone = document.importNode(columnsTemplate.content, true);

            dataHandler.getStatuses(board.dataset.id, function (statusData) {
                for (let status of statusData) {
                    let columnClone = document.importNode(columnTemplate.content, true);

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
                dom.toggleBoard(board);

            });


        }
        dom.loadCards();

    },

    toggleCreateBoard: function () {

        let toggleButton = document.getElementById('toggle-create-board');
        let template = document.getElementById('board-new');
        let newBoardDiv = document.querySelector('.new-board');
        let toggleImage = toggleButton.querySelector('i');

        toggleButton.addEventListener('click', function () {
            let clone = document.importNode(template.content, true);

            if (toggleImage.className === 'fas fa-plus') {
                toggleImage.className = 'fas fa-minus';
                newBoardDiv.prepend(clone);
                newBoardDiv.style.left = '55%';
                dom.createBoard()
            } else {
                toggleImage.className = 'fas fa-plus';
                newBoardDiv.removeChild(newBoardDiv.children[0]);
                newBoardDiv.style.left = '73%';
            }
        })

    },

    createBoard: function () {

        let button = document.getElementById('new-board');
        let boardName = document.getElementById('board-name');
        button.addEventListener('click', () => {
            let title = boardName.value;
            dataHandler.createNewBoard(`${title}`, () => {
                boardName.value = "";
                this.loadBoards();
            })

        })

    },

    loadCards: function () {
        // retrieves cards and makes showCards called

        dataHandler.getCards(dom.showCards)
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let cardTemplate = document.querySelector('#card-template');

        for (let card of cards) {

            let clone = document.importNode(cardTemplate.content, true);
            let columnToPopulate = document.querySelector(`[data-status-id='${card.status_id}']`);

            let title = clone.querySelector('.card-title');
            title.textContent = `${card.title}`;
            clone.querySelector(".card-remove").addEventListener('click', function () {
                dataHandler.deleteCard(`${card.id}`, dom.loadCards)
            });
            columnToPopulate.appendChild(clone);

        }


    },

    createCard: function () {

        const boards = document.getElementsByClassName('board');

        for (let board of boards) {

            let createCardButton = board.querySelector('.board-add');

            createCardButton.addEventListener('click', () => {
                let input = board.querySelector('.card-create-input');
                createCardButton.style.display = "none";
                input.style.display = "inline";
                input.addEventListener('keydown', function addCard(event) {
                    if (event.key === "Enter") {
                        let cardTitle = input.value;
                        dataHandler.createNewCard(`${cardTitle}`, `${board.id}`, function () {
                            dom.loadBoards();
                            input.value = "";
                            input.style.display = "none";
                            createCardButton.style.display = "inline";
                            input.removeEventListener('keydown', addCard
                            )
                        });
                    }
                })

            })
        }


    },

    renameBoard: function () {
        const boards = document.querySelector('.board-container');
        if (boards === null) {
            return;
        }
        for (let board of boards.children) {
            const renameBtn = board.querySelector('.board-title');
            if (renameBtn === null) {
                console.log('no span found');
            }
            renameBtn.addEventListener('click', function (event) {
                const boardTitle = event.target;
                let titleText = boardTitle.textContent;
                let inputField = document.createElement('input');
                inputField.setAttribute('type', 'text');
                inputField.setAttribute('value', titleText);
                boardTitle.innerHTML = '';
                boardTitle.appendChild(inputField);
                inputField.addEventListener('keydown', function (event) {
                        if (event.key === "Enter") {
                            let boardId = boardTitle.dataset.boardId;
                            let newTitle = event.target.value;
                            console.log(`id: ${boardId}, title: ${newTitle}`);
                            dataHandler.renameBoard(boardId, newTitle, dom.loadBoards);
                        }
                    }
                )
            })
        }
    },
    // here comes more features
    toggleBoard: function (board) {

        let toggle = board.querySelector('.board-toggle');
        let toggleImage = toggle.querySelector('i');
        let columnContainer = board.querySelector('.board-columns');
        toggle.addEventListener('click', function showBoardContents() {

            if (toggleImage.className === "fas fa-chevron-down") {
                columnContainer.style.display = "flex";
                toggleImage.className = "fas fa-chevron-up";
            } else {
                columnContainer.style.display = "none";
                toggleImage.className = "fas fa-chevron-down";

            }
        })
    },

    /* DELETES ONLY BOARD (no cards - yet) */

    deleteBoard: function () {
        let boards = document.getElementsByClassName('board');

        for (let board of boards) {
            let _delete = board.querySelector('.board-delete');
            _delete.addEventListener('click', function () {
                dataHandler.deleteBoard(`${board.dataset.id}`, function () {
                    dom.loadBoards();
                })
            })
        }
    },

    renameColumn: function (board) {
        let columns = board.getElementsByClassName('board-columns');

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
};
