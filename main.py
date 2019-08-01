from flask import Flask, render_template, url_for, request
from util import json_response
import json

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_boards()


@app.route('/create-board', methods=['POST'])
@json_response
def create_board():
    board = request.data

    board = json.loads(board)

    return data_handler.create_board(board)


@app.route('/rename-board', methods=['POST'])
@json_response
def rename_board():
    data = request.data
    data = json.loads(data)
    return data_handler.rename_board(data)


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    cards = data_handler.get_cards_for_board(board_id)
    return cards


@app.route("/delete-card/", methods=['POST'])
@json_response
def delete_card():

    card_to_delete = request.data
    card_to_delete = int(json.loads(card_to_delete))
    data_handler.delete_card(card_to_delete)
    return card_to_delete


@app.route('/delete-board', methods=['POST'])
@json_response
def delete_board():

    board_id = request.data
    board_id = json.loads(board_id)

    return data_handler.delete_board(board_id)


@app.route('/create-card/<int:board_id>', methods=['POST'])
@json_response
def create_card(board_id: int):
    card_title = request.data
    card_title = json.loads(card_title)

    return data_handler.create_card(card_title, board_id)

def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
