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


@app.route('/delete-board', methods=['POST'])
@json_response
def delete_board():

    board_id = request.data
    board_id = json.loads(board_id)

    return data_handler.delete_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
