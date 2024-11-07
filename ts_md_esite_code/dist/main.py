from fastapi import FastAPI
import os.path
import sqlite3

app = FastAPI()# app is up on port: 8000

@app.get("/")
def upload_image(image_path):
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(BASE_DIR, "brukerveiledning.db")
    
    file_name = os.path.basename(image_path)
    
    # Connect to the SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Insert image and its name into the database
    cursor.execute(''' INSERT INTO ImgTestTable (imgname, imgpath) VALUES (?,?)''', (file_name, image_path))
    
    conn.commit()
    conn.close()

# example usage
upload_image('.\mars.png')