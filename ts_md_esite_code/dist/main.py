from fastapi import FastAPI, File, UploadFile
import os.path
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
import hashlib

app = FastAPI()# app is up on port: 8000

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(BASE_DIR, "../src")
public_directory_path = os.path.join(BASE_DIR, '../dist/public')
app.get = public_directory_path

import shutil

def simple_hash(binary_data):
    hasher = hashlib.sha256()
    hasher.update(binary_data)
    return hasher.hexdigest()

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    file_location = f"public\\uploaded_images\\{file.filename}"
    
    filecontent = file.file.read()
    
    hash_result = simple_hash(filecontent)
    print(f"The SHA-256 hash of '{file.file}' is: {hash_result}")
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        db_path = os.path.join(BASE_DIR, "brukerveiledning.db")
    
        file_name = os.path.basename(file.filename)

       # Connect to the SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Insert image and its name into the database
        cursor.execute(''' INSERT INTO ImgTestTable (imgname, imgpath, imghash) VALUES (?,?,?)''', (file_name, '/uploaded_images/', hash_result))
        
        conn.commit()
        conn.close()

    return {"filename": file.filename}
