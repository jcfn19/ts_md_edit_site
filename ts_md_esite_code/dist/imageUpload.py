import os.path
import sqlite3

# Create a connection to the database (or create it if it doesn't exist)
# conn = sqlite3.connect('brukerveiledning.db')

# Commit and close the connection
# conn.commit()
# conn.close()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, "brukerveiledning.db")

def convert_to_binary_data(filename):
    # Open the image file in binary mode and return the binary data
    with open(filename, 'rb') as file:
        blob_data = file.read()
    return blob_data

def insert_image(image_name, image_path):
    # Convert image to binary data
    image_data = convert_to_binary_data(image_path)
    
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Insert image and its name into the database
    cursor.execute('''
        INSERT INTO ImgTestTable (imgname, imgdata)
        VALUES (?, ?)
    ''', (image_name, image_data))
    
    # Commit the transaction and close the connection
    conn.commit()
    conn.close()

# Example usage
insert_image('mars.png', '.\mars.png')