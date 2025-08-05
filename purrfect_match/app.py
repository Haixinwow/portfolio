from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_mysqldb import MySQL
import requests 
from flask_bcrypt import Bcrypt
# https://pypi.org/project/python-dotenv/
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
import json


import os

# https://www.geeksforgeeks.org/python/using-python-environment-variables-with-python-dotenv/
load_dotenv()

app = Flask(__name__, template_folder='template')
bcrypt = Bcrypt(app)
client = OpenAI()

# https://www.reddit.com/r/learnpython/comments/1c4k5ta/runtimeerror_the_session_is_unavailable_because/
app.secret_key = 'secret'
OPENAI_KEY = os.getenv('OPENAI_API_KEY')

# https://hevodata.com/learn/flask-mysql/
app.config['MYSQL_HOST'] = '3.22.77.126'
app.config['MYSQL_USER'] = 'finalproject'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'module7_creative_project'
app.config['MYSQL_PORT'] = 3306
 
mysql = MySQL(app)

# https://stackoverflow.com/questions/64070037/how-to-connect-python-backend-with-flask-and-htmlcss
@app.route("/")
def index():

    if session.get("username"):
        if session.get("profile_complete"): 
            return render_template("index.html", pets=recommendation(), username=session.get('username'), page="index")
        
    session['animal_type'] = ''
    url = ""
    ids = []
    if not session.get("username"):
        url = "https://api.rescuegroups.org/v5/public/animals/search/urgent"
    else: 
        url = "https://api.rescuegroups.org/v5/public/animals/search/available"
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
        
    # [10007851, 10059734, 10393561, 10072481, 10131543]
    # return (f"{ids}")
    
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }

    # https://documenter.getpostman.com/view/60615/SWT5j1e4?version=latest#51243d0a-ba88-4a18-8594-0dcad00d30b1
    params = {
        "include": "pictures"
    }

    response = requests.request("POST", url, headers=headers, params=params)
    data = response.json()
    
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))
        
        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "name": attr.get("name"),
            "id": id,
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })

    # return f"{pets}"
    return render_template("index.html", pets=pets, username=session.get('username'), page="index")

@app.route('/signin', methods = ['POST', 'GET'])
def signin():
    if request.method == 'POST':
        try: 
            username = request.form['username']
            password = request.form['password']

            cursor = mysql.connection.cursor()
            
            # This error is also caused when trying to format a single value into the string using %, if the value is a tuple: 
            # https://stackoverflow.com/questions/18053500/why-do-i-get-typeerror-not-all-arguments-converted-during-string-formatting-t
            cursor.execute(''' SELECT * from users where username = %s''',(username,))
           
            # https://dev.mysql.com/doc/connector-python/en/connector-python-api-mysqlcursor-fetchone.html
            user = cursor.fetchone()
            cursor.close()
            if user and bcrypt.check_password_hash(user[2], password):
                if user[3] or user[3] == 0:
                    session['profile_complete'] = True
                else: 
                    session['profile_complete'] = False
                session['username'] = username
                session['user_id'] = user[0]
                # return f"{user[3]}, {session['profile_complete']}"
                # return render_template("profile.html", complete = session['profile_complete'], )
                return redirect(url_for('index'))
            else: 
                is_valid = bcrypt.check_password_hash (user[2], password)
                return f"wrong username or password, {is_valid}, {user[2]}, {password}"
        except Exception as e:
            return f"Error occurred: {e}"
    return render_template('signin.html')

@app.route('/register', methods = ['POST', 'GET'])
def register():
    # https://hevodata.com/learn/flask-mysql/
    if request.method == 'POST':
        try: 
            username = request.form['username']
            password = request.form['password']

            cursor = mysql.connection.cursor()
            
            cursor.execute(''' SELECT * from users where username = %s''',(username,))
            user = cursor.fetchone()
            cursor.close()
            if user: 
                return f"Username taken!"
            else: 
                # https://www.geeksforgeeks.org/python/password-hashing-with-bcrypt-in-flask/
                hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

                cursor = mysql.connection.cursor()
                cursor.execute(''' INSERT INTO users (username, user_password) VALUES(%s,%s)''',(username,hashed_password))
                mysql.connection.commit()
                cursor.close()
                session['username'] = username

                cursor = mysql.connection.cursor()
                cursor.execute(''' SELECT * from users where username = %s''',(username,))
                user = cursor.fetchone()
                session['user_id'] = user[0]
                cursor.close()
                session["profile_complete"] = False
                
                return redirect(url_for('index'))
        except Exception as e:
            return f"Error occurred: {e}"

    return render_template('register.html')

@app.route('/signout', methods = ['POST', 'GET'])
def signout():
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/get_animals_dynamic', methods = ['POST', 'GET'])
def get_animals_dynamic():
    try: 
        data = request.get_json()
        pet_id = data.get('id')
        url = f"https://api.rescuegroups.org/v5/public/animals/{pet_id}"
        headers = {
                "Content-Type": "application/json",
                "Authorization": "q87kNsnz"
            }
        response = requests.request("GET", url, headers=headers)
        data = response.json()
        # return url
        all_pets = []
        for item in data.get("data", {}):
                id =item.get("id")
                attr = item.get("attributes", {})
                pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
                pic_ids = []
                for pic in pics:
                    pic_ids.append(pic.get("id"))

                included = data.get("included", {})
                urls = []
                for include in included: 
                    if include.get("type") == "pictures" and include.get("id") in pic_ids:
                        url = include.get("attributes", {}).get("large", {}).get("url")
                        urls.append(url)

                all_pets.append({
                    "name": attr.get("name"),
                    "id": id,
                    "breed": attr.get("breedString"),
                    "description": attr.get("descriptionHtml"),
                    "picture": pic_ids, 
                    "url": urls
                })
        return jsonify(all_pets)
    
    except Exception as e:
        return f"Error occurred: {e}"

@app.route('/dogs_puppies')
def dogs_puppies():
    session['animal_type'] = 'dogs'
    url = "https://api.rescuegroups.org/v5/public/animals/search/available/dogs"
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }

    response = requests.request("POST", url, headers=headers)
    data = response.json()
    
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))

        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "name": attr.get("name"),
            "id": id,
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })
    return render_template('dogs_puppies.html', pets=pets, username=session.get('username'), page="index")

@app.route('/cats_kittens')
def cats_kittens():
    url = "https://api.rescuegroups.org/v5/public/animals/search/available/cats"
    session['animal_type'] = 'cats'
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }

    response = requests.request("POST", url, headers=headers)
    data = response.json()
    
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))

        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "name": attr.get("name"),
            "id": id,
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls,
            "liked": liked
        })
    return render_template('cats_kittens.html', pets=pets, username=session.get('username'), page="index")

@app.route('/rabbits_bunnies')
def rabbits_bunnies():
    session['animal_type'] = 'rabbits'
    url = "https://api.rescuegroups.org/v5/public/animals/search/available/rabbits"
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }

    response = requests.request("POST", url, headers=headers)
    data = response.json()
    
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))
        
        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "id": id,
            "name": attr.get("name"),
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })
    return render_template('rabbits_bunnies.html', pets=pets, username=session.get('username'), page="index")

@app.route('/reptiles')
def reptiles():
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))

    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }
    params = {
        "include": "pictures", 
        "limit": 7
    }

    barnyard_types = ["frogs", "geckos", "iguanas", "lizards", "snakes", "tortoises", "turtles"]
    pets = []

    for type in barnyard_types: 
        # https://documenter.getpostman.com/view/60615/SWT5j1e4?version=latest#51243d0a-ba88-4a18-8594-0dcad00d30b1
        url = f"https://api.rescuegroups.org/v5/public/animals/search/available/{type}"
        response = requests.request("POST", url, headers=headers, params=params)
        data = response.json()
        for item in data.get("data", {}):
            id =item.get("id")
            attr = item.get("attributes", {})
            pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
            pic_ids = []
            for pic in pics:
                pic_ids.append(pic.get("id"))
            
            liked = False

            if id in ids: 
                liked = True

            included = data.get("included", {})
            urls = []
            for include in included: 
                if include.get("type") == "pictures" and include.get("id") in pic_ids:
                    url = include.get("attributes", {}).get("large", {}).get("url")
                    urls.append(url)

            pets.append({
                "name": attr.get("name"),
                "id": id,
                "breed": attr.get("breedString"),
                "description": attr.get("descriptionText"),
                "picture": pic_ids, 
                "url": urls, 
                "liked": liked
            })
    return render_template('reptiles.html', page="index", pets=pets, username=session.get('username'))

@app.route('/farm_animals')
def farm_animals():
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }
    params = {
        "include": "pictures", 
        "limit": 5
    }

    barnyard_types = ["alpacas", "chickens", "cows", "donkeys", "ducks", "geese", "goats", "horses", "pigs", "ponies", "sheep", "turkeys", "llama"]
    pets = []

    for type in barnyard_types: 
        # https://documenter.getpostman.com/view/60615/SWT5j1e4?version=latest#51243d0a-ba88-4a18-8594-0dcad00d30b1
        url = f"https://api.rescuegroups.org/v5/public/animals/search/available/{type}"
        response = requests.request("POST", url, headers=headers, params=params)
        data = response.json()
        for item in data.get("data", {}):
            id =item.get("id")
            attr = item.get("attributes", {})
            pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
            pic_ids = []
            for pic in pics:
                pic_ids.append(pic.get("id"))
            
            liked = False

            if id in ids: 
                liked = True

            included = data.get("included", {})
            urls = []
            for include in included: 
                if include.get("type") == "pictures" and include.get("id") in pic_ids:
                    url = include.get("attributes", {}).get("large", {}).get("url")
                    urls.append(url)

            pets.append({
                "name": attr.get("name"),
                "id": id,
                "breed": attr.get("breedString"),
                "description": attr.get("descriptionText"),
                "picture": pic_ids, 
                "url": urls, 
                "liked": liked
            })
    return render_template('farm_animals.html', page="index", pets=pets, username=session.get('username'))

@app.route('/other_animals')
def other_animals():
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    headers = {
        "Content-Type": "application/vnd.api+json",
        "Authorization": "q87kNsnz"
    }
    params = {
        "include": "pictures", 
        "limit": 3
    }

    barnyard_types = ["chinchillas", "degus", "rats", "ferrets", "fish", "gerbils", "hamsters", "hedgehogs", "guineapigs", "hermitcrabs", "mice", "otters", ]
    pets = []

    for type in barnyard_types: 
        # https://documenter.getpostman.com/view/60615/SWT5j1e4?version=latest#51243d0a-ba88-4a18-8594-0dcad00d30b1
        url = f"https://api.rescuegroups.org/v5/public/animals/search/available/{type}"
        response = requests.request("POST", url, headers=headers, params=params)
        data = response.json()
        for item in data.get("data", {}):
            id =item.get("id")
            attr = item.get("attributes", {})
            pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
            pic_ids = []
            for pic in pics:
                pic_ids.append(pic.get("id"))

            liked = False

            if id in ids: 
                liked = True

            included = data.get("included", {})
            urls = []
            for include in included: 
                if include.get("type") == "pictures" and include.get("id") in pic_ids:
                    url = include.get("attributes", {}).get("large", {}).get("url")
                    urls.append(url)

            pets.append({
                "name": attr.get("name"),
                "id": id,
                "breed": attr.get("breedString"),
                "description": attr.get("descriptionText"),
                "picture": pic_ids, 
                "url": urls, 
                "liked": liked
            })

    return render_template('other_animals.html', page="index", pets=pets, username=session.get('username'))




@app.route("/farm_animals_test")
def farm_animals_test():
    user_score = 0
    energy_level = ''
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))

    if session.get("profile_complete") and session.get("username"): 
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT house_type, children, special, noise FROM users where username = %s''',(session.get('username'),))
        user = cursor.fetchone()
        cursor.close() 

        user_score = user[0] * 20 + user[1] * 20 + user[2] * 20 + user[3] * 20

    if user_score < 40: 
        energy_level = 'Low'
    elif user_score < 80: 
        energy_level = 'Moderate'
    else: 
        energy_level = 'High'

    url = "https://api.rescuegroups.org/v5/public/animals/search/available"

    payload = json.dumps({
        "data": {
            "filters": [
            {
                "fieldName": "animals.energyLevel",
                "operation": "equal",
                "criteria": energy_level
            }
            ]
        }
    })
    params = {
        "include": "pictures", 
        "limit": 7
    }
    headers = {
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'q87kNsnz'
    }
    response = requests.request("POST", url, headers=headers, params=params, data=payload)
    data = response.json()
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        energy = attr.get("energyLevel")
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))
        
        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "id": id,
            "name": attr.get("name"),
            "energy": energy,
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })
    return jsonify(pets)
    
    # return jsonify(pets)

@app.route("/profile", methods = ['POST', 'GET'])
def profile():
    
    if request.method == 'POST':
        try: 
            living = request.form['living']
            child = request.form['child']
            special = request.form['special']
            noise = request.form['noise']

            cursor = mysql.connection.cursor()
            cursor.execute(''' UPDATE users SET house_type = %s, children = %s, special = %s, noise = %s where username = %s''',(living,child,special,noise,session.get('username')))
            mysql.connection.commit()
            cursor.close()
            session["profile_complete"] = True
        except Exception as e:
            return f"Error occurred: {e}"
        
    cursor = mysql.connection.cursor()
    cursor.execute(''' SELECT house_type, children, special, noise FROM users where username = %s''',(session.get('username'),))
    user = cursor.fetchone()
    cursor.close()

    if user[0] or user[0] == 0: 
        session["profile_complete"] = True
    else: 
        session["profile_complete"] = False
    return render_template('profile.html', username=session.get('username'), complete=session["profile_complete"], user=user)

@app.route("/search", methods = ['POST', 'GET'])
def search():
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))
    postal = request.form['postal']
    user_question = request.form['user_question']
    fine_tuned_answer = generate_user_intent(user_question).species
    url = f"https://api.rescuegroups.org/v5/public/animals/search/available/{fine_tuned_answer}/haspic?fields[animals]=name,distance&include=breeds,locations,pictures&sort=random&limit=10"

    payload = json.dumps({
        "data": {
            "filterRadius": {
            "miles": 50,
            "postalcode": postal
            }
        }
    })
    headers = {
    'Content-Type': 'application/vnd.api+json',
    'Authorization': 'q87kNsnz'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    data = response.json()

    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))
        
        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "id": id,
            "name": attr.get("name"),
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })

    return render_template('search_result.html', pets=pets, username=session.get('username'), page="index")

class Species(BaseModel):
    species: str

def generate_user_intent(question):
    prompt = f"Here is what user searched for: {question}, figure out what species of animal they are looking for. retrun me just the animal species name with no extra formating."
    try: 
        response = client.responses.parse(
            model="gpt-4.1",
            input=[
                {
                    "role": "system",
                    "content": "You are a user question fine tuner. Your job is to trying to figure out what the user is search for exactly. this is a pet adoption website and the search here is user searching for pets. they might have type or misspelling, it is your job to figure out what types of animals they are searching for. Valid species: alpacas, birds, cats,chickens, chinchillas, cows, degus, dogs, donkeys, ducks, ferrets, fish, frogs, geckos, geese, gerbils, goats, groundhogs, guineapigs, hamsters, hedgehogs, hermitcrabs,horses, iguanas, lizards, llama, mice, otters, pigs, ponies, prairiedogs, rabbits, rats, sheep, skunks, snakes, sugargliders, tarantulas, tortoises, turkeys, turtles."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ], 
            text_format=Species,
        )

        return response.output_parsed

    except Exception as e:
            return f"Error occurred: {e}"

@app.route('/save_animal', methods = ['POST', 'GET'])
def save_animal():
    try: 
        username = session.get('username')
        data = request.get_json()
        
        # get the user id
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT * from users where username = %s''',(username,))
        user = cursor.fetchone()
        session['user_id'] = user[0]
        cursor.close()

        liked = False

        # check if it is already liked 
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT * from interest_list where user_id = %s AND pet_id = %s''',(user[0], data.get('id')))
        exist = cursor.fetchone()
        cursor.close()

        if exist: 
            # delete from db
            cursor = mysql.connection.cursor()
            cursor.execute(''' DELETE FROM interest_list where user_id = %s AND pet_id = %s''',(user[0],data.get('id')))
            mysql.connection.commit()
            cursor.close()
        else: 
            # insert user id and pet id
            cursor = mysql.connection.cursor()
            cursor.execute(''' INSERT INTO interest_list (user_id, pet_id) VALUES(%s,%s)''',(user[0],data.get('id')))
            mysql.connection.commit()
            cursor.close()
            liked = True
        
        return jsonify({"success": True, "liked": liked})
    except Exception as e:
        return f"Error occurred: {e}"
    
@app.route('/interest_list', methods = ['POST', 'GET'])
def interest_list():
    try: 
        id = session.get('user_id')
        
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(id,))
        lists = cursor.fetchall()
        cursor.close()

        all_pets = []
        for list in lists: 
            url = f"https://api.rescuegroups.org/v5/public/animals/{list[1]}"
            headers = {
                "Content-Type": "application/json",
                "Authorization": "q87kNsnz"
            }
            response = requests.request("GET", url, headers=headers)
            data = response.json()
            # return (data)
            for item in data.get("data", {}):
                id =item.get("id")
                attr = item.get("attributes", {})
                pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
                pic_ids = []
                for pic in pics:
                    pic_ids.append(pic.get("id"))

                included = data.get("included", {})
                urls = []
                for include in included: 
                    if include.get("type") == "pictures" and include.get("id") in pic_ids:
                        url = include.get("attributes", {}).get("large", {}).get("url")
                        urls.append(url)

                all_pets.append({
                    "name": attr.get("name"),
                    "id": id,
                    "breed": attr.get("breedString"),
                    "description": attr.get("descriptionText"),
                    "picture": pic_ids, 
                    "url": urls
                })
        return render_template('interest_list.html', username=session.get('username'), pets=all_pets)
    except Exception as e:
        return f"Error occurred: {e}"

def recommendation():

    # rules: 0-20   =  low energy pet
    #        40-60  =  medium energy pet
    #        80-100 =  high energy pet 

    user_score = 0
    energy_level = ''
    ids = []
    if session.get("username"):
        cursor = mysql.connection.cursor()
            
        cursor.execute(''' SELECT * from interest_list where user_id = %s''',(session.get("user_id"),))
        pet_ids = cursor.fetchall()
        cursor.close()

        for id in pet_ids: 
            ids.append(str(id[1]))

    if session.get("profile_complete") and session.get("username"): 
        cursor = mysql.connection.cursor()
        cursor.execute(''' SELECT house_type, children, special, noise FROM users where username = %s''',(session.get('username'),))
        user = cursor.fetchone()
        cursor.close() 

        print("HERE IS THE USER DATA: ")
        print (f"{user}")
        print("JUST PRINTED THE USER DATA: ")

        user_score = user[0] * 20 + user[1] * 20 + user[2] * 20 + user[3] * 20

    if user_score < 40: 
        energy_level = 'Low'
    elif user_score < 80: 
        energy_level = 'Moderate'
    else: 
        energy_level = 'High'

    url = "https://api.rescuegroups.org/v5/public/animals/search/available"

    payload = json.dumps({
        "data": {
            "filters": [
            {
                "fieldName": "animals.energyLevel",
                "operation": "equal",
                "criteria": energy_level
            }
            ]
        }
    })
    params = {
        "include": "pictures", 
        "limit": 7
    }
    headers = {
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'q87kNsnz'
    }
    response = requests.request("POST", url, headers=headers, params=params, data=payload)
    data = response.json()
    pets = []
    for item in data.get("data", {}):
        id =item.get("id")
        attr = item.get("attributes", {})
        pics = item.get("relationships", {}).get("pictures", {}).get("data", [])
        pic_ids = []
        for pic in pics:
            pic_ids.append(pic.get("id"))
        
        liked = False

        if id in ids: 
            liked = True

        included = data.get("included", {})
        urls = []
        for include in included: 
            if include.get("type") == "pictures" and include.get("id") in pic_ids:
                url = include.get("attributes", {}).get("large", {}).get("url")
                urls.append(url)

        pets.append({
            "id": id,
            "name": attr.get("name"),
            "breed": attr.get("breedString"),
            "description": attr.get("descriptionText"),
            "picture": pic_ids, 
            "url": urls, 
            "liked": liked
        })
    return pets