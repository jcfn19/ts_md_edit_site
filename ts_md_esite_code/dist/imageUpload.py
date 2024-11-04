import sys
from fastapi import FastAPI
# import os.path
# import sqlite3

app = FastAPI()

# # db path
# BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# db_path = os.path.join(BASE_DIR, "brukerveiledning.db")

# def convert_to_binary_data(filename):
#     with open(filename, 'rb') as file:
#         blob_data = file.read()
#     return blob_data

# def insert_image(image_name, image_path):
#     # Convert image to binary data
#     image_data = convert_to_binary_data(image_path)
    
#     # Connect to the SQLite database
#     conn = sqlite3.connect(db_path)
#     cursor = conn.cursor()
    
#     # Insert image and its name into the database
#     cursor.execute('''
#         INSERT INTO ImgTestTable (imgname, imgdata)
#         VALUES (?, ?)
#     ''', (image_name, image_data))
    
#     # Commit the changes and close the connection
#     conn.commit()
#     conn.close()

# # Example usage
# insert_image('mars.png', '.\mars.png')

@app.get("/")
def index():
    return print(sys.path)