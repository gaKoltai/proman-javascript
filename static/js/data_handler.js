// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url,{
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(jsonResponse => callback(jsonResponse));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        // it is not called from outside
        // sends the data to the API, and calls callback function
        fetch(url,{
            method: 'POST',
            credentials: 'same-origin',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(callback)

    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (boardId, callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get(`/get-statuses/${boardId}`, response => callback(response))
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (boardId, callback) {
        // the cards are retrieved and then the callback function is called with the cards
        this._api_get(`/get-cards/${boardId}`,response=>callback(response))
    },
    getCards: function(callback){
        this._api_get('/get-all-cards', response => callback(response))
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        this._api_post('/create-board', boardTitle, callback)

    },
    createNewCard: function (cardTitle, boardId, callback) {

        this._api_post(`/create-card/${boardId}`, cardTitle, callback)
    },
    renameBoard: function (id, title, callback) {
        let data = {'id': id, 'title': title};
        this._api_post('/rename-board', data, response => {callback();});
        console.log('data handler communication');
    },
    deleteBoard: function(boardId, callback) {
        this._api_post('/delete-board', boardId, callback)
    },

    deleteCard: function(cardId, callback) {
        this._api_post('/delete-card', cardId, callback)

    },

    renameColumn: function(statusId, statusTitle, callback){
        this._api_post(`/rename-status/${statusId}`, statusTitle, callback)
    }

     // here comes more features
};
