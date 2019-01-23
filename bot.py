import praw
import psycopg2 as pg
import time
import os

# logs Webster into reddit
def login():
	# conn = pg.connect(database="wtw") # for local testing
	DATABASE_URL = os.environ['DATABASE_URL']
	conn = pg.connect(DATABASE_URL, sslmode='require')

	return praw.Reddit(	username="WebsterBot",
						password="G*c-+#6d^8V%$_6=",
						client_id="7fxaMpqGd1ZL3Q",
						client_secret="-53rL59GAmNJDDyO6w2dIQOPI50",
						user_agent="actualsnek wtwbot test 0.0"), conn

# receives reddit instance and reads through new subreddit comments for calls
def run(r, conn):
	cur = conn.cursor()
	for c in r.subreddit("whatstheword").comments(limit=10):
		word = ""
		if "!thewordis" in c.body:
			a = c.body.split() # make array of calling comment
			for i in range(0, len(a)):
				if "!thewordis" in a[i]:
					word = a[i+1] # right word is the one 1 ahead of !thewordis
					print(word)
			
			cur.execute("SELECT exists(SELECT 1 FROM words WHERE thread = '" + c.link_id + "');")
			d = cur.fetchone()

			p = c.parent() # parent comment/submission object
			if hasattr(p, "body") and c.is_submitter and not d[0] and not c.author == p.author: # if p is a comment and c author is OP and thread hasn't been done yet
				cur.execute("INSERT INTO words(word, thread) values('" + word + "', '" + c.link_id + "');") # mark thread as done
				conn.commit()
				update_flair(p.author, cur, conn)
				p.reply("Congratulations, " + str(p.author) + "! You've been awarded 1W for the word: *" + word + "*!")
			elif not hasattr(p, "body"): # if p isn't a comment
				c.reply("You can't know the word already!")
			elif not c.is_submitter: # if c author isn't OP
				c.reply("This isn't something you get to decide!")
			elif c.author == p.author: # if OP answers their own post
				c.reply("Why are you mining points that don't even count for karma?!")

# receives an author username and adds one point to flair
def update_flair(usr, cur, conn):
	usr = usr.name
	new = 0

	cur.execute("SELECT name, points FROM users;") 
	l = cur.fetchall() # fetches users from db

	for i in l:
		if i[0] == usr: # if found user
			new = i[1] + 1 # increase points by one
			cur.execute("UPDATE users SET points = " + str(new) + " WHERE name = '" + usr + "';")
			conn.commit()

	if new == 0: # if points still 0 i.e. did not find user
		cur.execute("INSERT INTO users(name, points) VALUES('" + usr + "', 1);") # first point
		conn.commit()

	# checks if user's flair exists
	if r.subreddit("whatstheword").flair(limit=None) not in globals():
		print("No flair")
		r.subreddit("whatstheword").flair.set(usr, str(new) + "W") # create flair, set to user's points

r, conn = login()
while True:
	run(r, conn)
	print("-----------Waiting 10 S----------")
	time.sleep(10)

cur.close()
conn.close()
