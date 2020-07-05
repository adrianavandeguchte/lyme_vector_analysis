# Import libraries
import sqlalchemy
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template

# Connect to Database,
#engine = create_engine('postgresql://postgres:cyclone1@localhost:5432/lymevectoranalysis')

engine = create_engine('postgresql://hehyvkiqvzdmhq:e0d26d100db3ce0a397229444efb4bbc7ebd9c2d2b56e15477f677f2fe1ece41@ec2-52-0-155-79.compute-1.amazonaws.com/dchplfe6pe6n1h')

# db_host= "ec2-52-0-155-79.compute-1.amazonaws.com"
# db_name = "dchplfe6pe6n1h"
# db_user ="hehyvkiqvzdmhq"
# db_password = "e0d26d100db3ce0a397229444efb4bbc7ebd9c2d2b56e15477f677f2fe1ece41"

app = Flask(__name__)


@app.route("/")
def get_map_data():
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

if __name__ == "__main__":
    app.run(debug=True)

