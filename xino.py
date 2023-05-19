from flask import Flask, render_template, request, redirect, url_for, session
from flask_mysqldb import MySQL
import MySQLdb.cursors
from zenora import APIClient
from werkzeug.utils import secure_filename
import mysql.connector
import mysql

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_DB'] = 'xino'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'toor'

mysql = MySQL(app)

@app.route("/post/signup", methods=["POST", "GET"])
def ajaxsignup():
    name = request.form.get("signup-name")
    email = request.form.get("signup-email")
    username = request.form.get("signup-username")
    password = request.form.get("signup-password")
    dd = int(request.form.get("dob-dd"))
    mm = int(request.form.get("dob-mm"))
    yyyy = int(request.form.get("dob-yyyy"))
    return 0

@app.route('/', methods=['GET', 'POST'])
def index():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    return render_template('index.html')

if __name__ == "__main__":    
    app.run(debug=True)
app.run(debug=True)