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
    result_set = engine.execute("select fips_code, COALESCE(county_status,'No records') from tickstatus")
    tick_list = []
    for r in result_set:
        row = [r[0],r[1]]
        tick_list.append(row)
    tick_data = {'loc': tick_list}

    result_set = engine.execute("select concat(substring(to_char(st_cty_code, 'FM999999') from 1 for 1),substring(to_char(st_cty_code, 'FM999999') from 2 for 3)),cases from lymenation where state in ('AL','AK','AZ','AR','CA','CO','CT') union select concat(substring(to_char(st_cty_code, 'FM999999') from 1 for 2),right(concat('0',substring(to_char(st_cty_code, 'FM999999') from 3 for 3)),3)),cases from lymenation where state not in ('AL','AK','AZ','AR','CA','CO','CT')")

    lyme_list = []
    for r in result_set:
        row = [r[0],r[1]]
        lyme_list.append(row)
    lyme_data = {'loc': lyme_list}

    data = [tick_data, lyme_data]
    return render_template("index.html", data=data)



# @app.route("/tick_data")
# def tick_data():
#     result_set = engine.execute("select fips_code, COALESCE(county_status,'No records') from tickstatus")
#     tick_list = []
#     for r in result_set:
#         row = [r[0],r[1]]
#         tick_list.append(row)
#         tick_data = {'loc': tick_list}
#     return jsonify(tick_data)
#
# @app.route("/lyme_data")
# def lyme_data():
#     result_set = engine.execute("select concat(substring(to_char(st_cty_code, 'FM999999') from 1 for 1),substring(to_char(st_cty_code, 'FM999999') from 2 for 3)),cases from lymenation where state in ('AL','AK','AZ','AR','CA','CO','CT') union select concat(substring(to_char(st_cty_code, 'FM999999') from 1 for 2),right(concat('0',substring(to_char(st_cty_code, 'FM999999') from 3 for 3)),3)),cases from lymenation where state not in ('AL','AK','AZ','AR','CA','CO','CT')")
#     lyme_list = []
#     for r in result_set:
#         row = [r[0],r[1]]
#         lyme_list.append(row)
#     lyme_data = {'loc': lyme_list}
#     return jsonify(lyme_data)




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