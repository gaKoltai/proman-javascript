import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";

export const listeners = {

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
            true)

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
    }

};