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
    
    folder_name = "uploaded_images"
    
    # make sure the folder exists
    if not os.path.exists(f"public\\{folder_name}"):
        os.makedirs(f"public\\{folder_name}")


    # Get the hash of the file      
    filecontent = file.file.read()
    hash_result = simple_hash(filecontent)
    print(f"The SHA-256 hash of '{file.file}' is: {hash_result}")

    # Reset the file pointer to the beginning
    file.file.seek(0)

    # get the extension of the file, and create a new file name with the hash
    file_name, file_extension = os.path.splitext(file.filename)
    new_file_name = hash_result + file_extension
    file_location = f"public\\{folder_name}\\{new_file_name}"
        
    #check if the file already exists by checking the hash
    db_path = os.path.join(BASE_DIR, "brukerveiledning.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''SELECT * FROM ImgTestTable WHERE imghash = ?''', (hash_result,))
    if cursor.fetchone():
        conn.close()
        return {"filename": new_file_name, "status": "File already exists"}
    
    
    # Save the file to the server
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    # Insert the image into the database
    db_path = os.path.join(BASE_DIR, "brukerveiledning.db")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute(''' INSERT INTO ImgTestTable (imgname, imgpath, imghash) VALUES (?,?,?)''', (file_name, "/" + folder_name + "/", hash_result))
    
    conn.commit()
    conn.close()

    return {"filename": new_file_name} # return the new file name
