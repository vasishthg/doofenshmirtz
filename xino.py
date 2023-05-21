from flask import Flask, render_template, request, redirect, url_for, session,send_file
from flask_mysqldb import MySQL
import MySQLdb.cursors
from zenora import APIClient
import os
from werkzeug.utils import secure_filename
import mysql.connector
import requests
import mysql
import json
import subprocess
from flask_basicauth import BasicAuth

app = Flask(__name__)
app.config['SECRET_KEY'] = "xino"
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_DB'] = 'xino'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'toor'
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['BASIC_AUTH_USERNAME'] = 'upload'
app.config['BASIC_AUTH_PASSWORD'] = 'xino-videoupload'
basic_auth = BasicAuth(app)

headers = {
            "X-RapidAPI-Key": "1700480626msh4d4f83cf6b26be5p1c6c1fjsn5804ffc22235",
            "X-RapidAPI-Host": "cricbuzz-cricket.p.rapidapi.com"
        }
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
    dob = str(yyyy) + "-" + str(mm) + "-" + str(dd)
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM users WHERE username=%s", (username,))
    if cur.fetchone():
        return str(), 409
    cur.execute("INSERT INTO users (name, email, username, password, dob) VALUES (%s, %s, %s, %s, %s)", (name, email, username, password, dob)) 
    mysql.connection.commit()
    cur.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
    user = cur.fetchone()
    if user:
        session['user'] = user
        session['id'] = user['id']
        session['loggedin'] = True
        session['email'] = user['email']
        return "ee", 200
    return "ee"

@app.route("/post/login", methods=["POST", "GET"])
def ajaxlogin():
    username = request.form.get("login-email")
    password = request.form.get("login-password")
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT * FROM users WHERE username=%s AND password=%s", (username, password))
    user = cur.fetchone()
    if user:
        session['user'] = user
        session['id'] = user['id']
        session['loggedin'] = True
        session['email'] = user['email']
        return "ee", 200
    else:
        return "error", 409

@app.route("/logout", methods=["POST", "GET"])
def logout():
    session.pop('user', None)
    session.pop('id', None)
    session.pop('loggedin', None)
    session.pop('email', None)
    return redirect('/')

@app.route('/post/team/<int:id>', methods=['GET', 'POST'])
def team(id):
    if 'loggedin' in session:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        # remove prev team follow
        cur.execute("SELECT following FROM users WHERE email = %s", [session['email']])
        follteam = cur.fetchone()
        if follteam['following'] != None:
            cur.execute("SELECT * FROM teams WHERE teamabbrv = %s", [follteam['following']])
            targetteam=cur.fetchone()
            cur.execute("UPDATE teams SET followers = %s WHERE teamabbrv = %s", [targetteam['followers']-1 ,targetteam['teamabbrv']])
            mysql.connection.commit()
        # set new team shit
        cur.execute("SELECT * FROM teams WHERE id = %s", [id])
        team = cur.fetchone()
        cur.execute("UPDATE users SET following=%s WHERE email = %s", (team['teamabbrv'], session['email']))
        mysql.connection.commit()
        cur.execute("UPDATE teams SET followers=%s WHERE teamabbrv = %s", (team['followers']+1, team['teamabbrv']))
        mysql.connection.commit()

        return 'ee', 200
    return "error", 510

@app.route('/', methods=['GET', 'POST'])
def index():
    if 'loggedin' in session:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM users WHERE email=%s", (session['email'],))
        user = cur.fetchone()
        cur.execute("SELECT * FROM teams WHERE id=%s", (user['following'],))
        team = cur.fetchone()
        return render_template('index.html', user=user, team=team)
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    return render_template('index.html')

@app.route('/updates', methods=['GET', 'POST'])
def updates():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    if 'loggedin' in session:
        cur.execute("SELECT * FROM teams")
        teams = cur.fetchall()
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM users WHERE email=%s", (session['email'],))
        user = cur.fetchone()
        cur.execute("SELECT * FROM teams WHERE id=%s", (user['following'],))
        team = cur.fetchone()
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        livematches = "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/live"

        

        lmresponse = requests.get(livematches, headers=headers)
        lmresponse = lmresponse.json()
        series = "https://cricbuzz-cricket.p.rapidapi.com/series/v1/5945"
        srsresponse = requests.get(series, headers=headers)
        srsresponse = srsresponse.json()
        
        ipl_matches = []
        
        for match_type in lmresponse['typeMatches']:
            if match_type['matchType'] == 'League':
                for series_match in match_type['seriesMatches']:
                    if series_match['seriesAdWrapper']['seriesName'] == 'Indian Premier League 2023':
                        for match in series_match['seriesAdWrapper']['matches']:
                            ipl_matches.append(match)
        for match in ipl_matches:
            series_name = match["matchInfo"]["seriesName"]
            print(series_name)
            match_id = match["matchInfo"]["matchId"]
            match_format = match["matchInfo"]["matchFormat"]
            state = match["matchInfo"]["state"]
            status = match["matchInfo"]["status"]
            team1_name = match["matchInfo"]["team1"]["teamName"]
            team2_name = match["matchInfo"]["team2"]["teamName"]
            team1_sname = match["matchInfo"]["team1"]["teamSName"]
            team2_sname = match["matchInfo"]["team2"]["teamSName"]
            if 'matchScore' in match:
                match_score = match['matchScore']["team1Score"]["inngs1"]
            team_id = match["matchInfo"]["team1"]["teamId"]
            if 'currBatTeamId' in match["matchInfo"]:
                current_bat_team_id = match["matchInfo"]["currBatTeamId"]

            ipl_match = {
                "series_name": series_name,
                "match_format": match_format,
                "state": state,
                "status": status,
                "team1_name": team1_name,
                "team2_name": team2_name,
                "team1_sname": team1_sname,
                "team2_sname": team2_sname,
                "team_id": team_id,
            }
            if 'matchScore' in match:
                ipl_match["match_score"] = match_score
                return render_template('updates.html', user=user, teams=teams, ipl_matches=ipl_matches, team1img=team1img, team2img=team2img, match = match, ipl_match= ipl_match, match_score=match_score)       

            print(ipl_match)
            cur.execute("SELECT imgurl FROM teams WHERE teamabbrv = %s", [team1_sname])
            team1img = cur.fetchone()['imgurl']
            cur.execute("SELECT imgurl FROM teams WHERE teamabbrv = %s", [team2_sname])
            team2img = cur.fetchone()['imgurl']
            return render_template('updates.html', user=user, teams=teams, ipl_matches=ipl_matches, team1img=team1img, team2img=team2img, match = match, ipl_match= ipl_match)       
        
        
        return render_template('updates.html', user=user, teams=teams)
    cur.execute("SELECT * FROM teams")
    teams = cur.fetchall()
    
    return render_template('updates.html', teams=teams)
@app.route('/admin/upload', methods=['GET', 'POST'])
@basic_auth.required
def upload():
    if request.method == 'POST':
        if 'video' not in request.files:
            return 'No video file uploaded'

        video_file = request.files['video']
        if video_file.filename == '':
            return 'No video file selected'

        video_filename = secure_filename(video_file.filename)
        video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_filename)
        video_file.save(video_path)

        vr_filename = 'vr_' + video_filename
        vr_path = os.path.join(app.config['UPLOAD_FOLDER'], vr_filename)
        convert_to_vr(video_path, vr_path)

        return 'Video uploaded and converted successfully'

    return render_template('upload.html')

def convert_to_vr(input_file, output_file):
    conversion_command = f'ffmpeg -i {input_file} -c:v libx264 -b:v 5M -vf "v360=e:e:yaw=180" {output_file}'
    subprocess.call(conversion_command, shell=True)

@app.route('/vr_videos/<filename>')
def get_vr_video(filename):
    vr_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    return send_file(vr_file_path)

@app.route('/vr', methods=['GET'])
def vr():
    vr_video_files = get_vr_video_files()
    if not vr_video_files:
        return 'No VR videos available'

    latest_vr_video = vr_video_files[-1]
    return render_template('vr.html', latest_vr_video=latest_vr_video)

def get_vr_video_files():
    vr_files = []
    for file in os.listdir(app.config['UPLOAD_FOLDER']):
        if file.startswith('vr_') and file.endswith('.mp4'):
            vr_files.append(file)
    return vr_files


@app.route('/post/event/unfollow', methods=['GET', 'POST'])
def unfollow():
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute("SELECT following FROM users WHERE email = %s", [session['email']])
    follteam = cur.fetchone()
    if follteam['following'] != None:
        cur.execute("SELECT * FROM teams WHERE teamabbrv = %s", [follteam['following']])
        targetteam=cur.fetchone()
        cur.execute("UPDATE teams SET followers = %s WHERE teamabbrv = %s", [targetteam['followers']-1 ,targetteam['teamabbrv']])
        mysql.connection.commit()
        cur.execute("UPDATE users SET following = %s WHERE email = %s", [None ,session['email']])
        mysql.connection.commit()
        return 'ee', 200
    return 'ee', 500

@app.route('/book/tickets', methods=['GET', 'POST'])
def book():
    if 'loggedin' in session:
        cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cur.execute("SELECT * FROM users WHERE email=%s", (session['email'],))
        user = cur.fetchone()
        cur.execute("SELECT * FROM teams WHERE id=%s", (user['following'],))
        teams = cur.fetchone()
        url = "https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming"
        upresponse = requests.get(url, headers=headers)
        upresponse = (upresponse.json())
        ipl_matches = []
        for match_type in upresponse['typeMatches']:
            if match_type['matchType'] == 'League':
                for series_match in match_type['seriesMatches']:
                    if series_match['seriesAdWrapper']['seriesName'] == 'Indian Premier League 2023':
                        for match in series_match['seriesAdWrapper']['matches']:
                            ipl_matches.append(match)
                                
        for match in ipl_matches:
            series_name = match["matchInfo"]["seriesName"]
            match_id = match["matchInfo"]["matchId"]
            match_format = match["matchInfo"]["matchFormat"]
            state = match["matchInfo"]["state"]
            team1_name = match["matchInfo"]["team1"]["teamName"]
            team2_name = match["matchInfo"]["team2"]["teamName"]
            team1_sname = match["matchInfo"]["team1"]["teamSName"]
            team2_sname = match["matchInfo"]["team2"]["teamSName"]
            if 'matchScore' in match:
                match_score = match['matchScore']["team1Score"]["inngs1"]
            team_id = match["matchInfo"]["team1"]["teamId"]
            if 'currBatTeamId' in match["matchInfo"]:
                current_bat_team_id = match["matchInfo"]["currBatTeamId"]

            ipl_match = {
                "series_name": series_name,
                "match_format": match_format,
                "state": state,
                "team1_name": team1_name,
                "team2_name": team2_name,
                "team1_sname": team1_sname,
                "team2_sname": team2_sname,
                "team_id": team_id,
            }
            print(ipl_matches)
            cur.execute("SELECT imgurl FROM teams WHERE teamabbrv = %s", [team1_sname])
            team1img = cur.fetchone()['imgurl']
            cur.execute("SELECT imgurl FROM teams WHERE teamabbrv = %s", [team2_sname])
            team2img = cur.fetchone()['imgurl']
            if 'matchScore' in match:
                ipl_match["match_score"] = match_score
                return render_template('book.html', user=user, teams=teams, ipl_matches=ipl_matches, team1img=team1img, team2img=team2img, match = match, ipl_match= ipl_match, match_score=match_score)       
            return render_template('book.html', user=user, teams=teams, ipl_matches=ipl_matches, team1img=team1img, team2img=team2img, match = match, ipl_match= ipl_match)       
        return render_template('book.html', user=user, team=team)
        # return render_template ("book.html")
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    return render_template('book.html')

if __name__ == '__main__':
    app.run(debug=True)
app.run(debug=True)