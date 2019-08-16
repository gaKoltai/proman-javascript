export let listeners = {

    customEventListener: function (element, event, handler) {

        const rootElement = document.querySelector('body');

        rootElement.addEventListener(event, function (e) {
                let target = e.target;
                while (target != null) {
                    if (target.matches(element)) {
                        handler(e);
                        return;
                    }
                    target = target.parentElement
                }

            },
            false)
    },

    deleteBoard: function (callback) {

        listeners.customEventListener('.board-delete', 'click', function (event) {
            callback(event)
        })
    },

    toggleCreateBoard: function (callback) {

        listeners.customEventListener('.toggle-create-board', 'click', function(event){
            callback(event)
        })
    },

    createBoard: function(callback) {
        listeners.customEventListener('#new-board', 'click', function (event) {
            callback(event)
        })
    },

    openBoard: function(callback) {
        listeners.customEventListener('.board-toggle', 'click', function(event){
            callback(event)
        })
    },

    createCard: function(callback) {
        listeners.customEventListener('.card-add', 'click', function(event){
            callback(event)
        })
    },

    sendNewCardsName: function(callback) {
        listeners.customEventListener('.card-add-btn', 'click', function (event) {
            callback(event)
        })
    },

    renameBoard: function(callback) {
        listeners.customEventListener('.board-title', 'click', function(event){
            callback(event)
        })
    },

    sendNewBoardName: function(callback) {
        listeners.customEventListener('.board-rename-input', 'keydown', function(event){
            callback(event)
        })
    },

    deleteCard: function (callback) {
        listeners.customEventListener('.card-remove', 'click', function (event) {
            callback(event)
        })

    }

};