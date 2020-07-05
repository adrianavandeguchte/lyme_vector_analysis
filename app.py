#Import dependecies
#All DB queries are in dbFunction file
from dbFunction import *
from flask import render_template

#Take care of page not found  
@app.errorhandler(404) 
  
# Use inbuilt function which takes error as parameter 
def not_found(e): 
  #redirect to home page - we can always show custom page
  return render_template("popLyme.html", title="Lyme Vecrtoe Analysis") 

#Define routes - this is used for assignment purpose to show output in JSON format
@app.route("/")
@app.route("/api/v1.0/")
def homepage():
    #Defsult page that lists all API and corresponding URL
    return render_template("popLyme.html", title="Lyme Vecrtoe Analysis") 

@app.route("/api/v1.0/deerpopLyme") 
def deerpopLyme():
    #Get deerpopLyme results
    deerLymen_dict = fDeerpopLymeCount()
    print(deerLymen_dict)
    #Return json output
    return deerLymen_dict

#Application set to debug mode - update debug flag = Flase once testing is done
if __name__ == '__main__':
    app.run(debug=True)