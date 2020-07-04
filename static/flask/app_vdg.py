# Import libraries
import sqlalchemy
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
from config import password

app = Flask(__name__)

# Connect to Database,
engine = create_engine(f'postgresql://hehyvkiqvzdmhq:{password}@ec2-52-0-155-79.compute-1.amazonaws.com:5432/dchplfe6pe6n1h')

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/lymedogs")
def lyme_dogs():
    result_prox = engine.execute("select * from lymedogs")
    lymedogs = []
    for r in result_prox:
        row = {"year":r[1],"county":r[2],"positive_cases":r[3]}
        lymedogs.append(row)
    return jsonify(lymedogs)

@app.route("/lymepeople")
def lyme_people():
    result_prox = engine.execute("select * from lymepeople")
    lymepeople = []
    for r in result_prox:
        row = {"year":r[1],"county":r[2],"cases":r[3]}
        lymepeople.append(row)
    return jsonify(lymepeople)


if __name__ == "__main__":
    app.run(debug=True)
