import persistence
import connection
from psycopg2 import sql


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


@connection.connection_handler
def get_boards(cursor):
    cursor.execute("""
                    SELECT * FROM boards
                    ORDER BY id;
                    """)

    boards = cursor.fetchall()

    return boards


def board_create(board):
    board_id = create_board(board)
    board_id = board_id[0]['id']
    create_statuses(board_id)


@connection.connection_handler
def create_board(cursor, board):
    cursor.execute("""
                    INSERT INTO boards
                    (title)
                    VALUES (%(title)s)
                    RETURNING id;
                    """, {'title': board})
    return cursor.fetchall()


@connection.connection_handler
def create_statuses(cursor, board_id):
    cursor.execute("""
                    INSERT INTO statuses
                    (title, board_id)
                    VALUES 
                    ('New', %(board_id)s),
                    ('In Progress', %(board_id)s),
                    ('Testing', %(board_id)s),
                    ('Done', %(board_id)s);
                    """, {'board_id': board_id})


@connection.connection_handler
def rename_board(cursor, board_data):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(new_title)s
                    WHERE id = %(board_id)s
    """, {'board_id': board_data['id'],
          'new_title': board_data['title']})


@connection.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""SELECT * FROM cards
                     WHERE board_id = %(id)s
                     """, {'id': board_id})
    matching_cards = cursor.fetchall()
    return matching_cards


@connection.connection_handler
def get_all_cards(cursor):
    cursor.execute("""
                    SELECT * FROM cards
                    """)
    return cursor.fetchall()


@connection.connection_handler
def get_statuses(cursor, board_id):
    cursor.execute("""
                    SELECT id, title FROM statuses
                    WHERE board_id = %(board_id)s
    """, {'board_id': board_id})
    statuses = cursor.fetchall()
    return statuses


@connection.connection_handler
def delete_board(cursor, boardId):
    cursor.execute("""
                    DELETE FROM boards
                    WHERE id = %(id)s
                    """, {'id':boardId})


@connection.connection_handler
def create_card(cursor, card_title, board_id):

    cursor.execute("""
                    SELECT id FROM statuses
                    WHERE board_id = %(board_id)s
                    ORDER BY id
                    LIMIT 1;
                    """,{'board_id': board_id})

    status_id = cursor.fetchall()[0]['id']

    cursor.execute("""
                    INSERT INTO cards
                    (board_id, title, status_id, card_order)
                    VALUES(%(board_id)s, %(title)s, %(status_id)s, 0)
                    """, {'board_id': board_id, 'title': card_title, 'status_id': status_id })


@connection.connection_handler
def delete_card(cursor, cardId):
    cursor.execute("""
                    DELETE FROM cards WHERE id = %(id)s
                    """,{'id': cardId})



@connection.connection_handler
def rename_status(cursor, status_id, status_title):
    cursor.execute("""
                    UPDATE statuses
                    SET title = %(title)s
                    WHERE id = %(id)s                    
                    """, {'title': status_title, 'id': status_id})
