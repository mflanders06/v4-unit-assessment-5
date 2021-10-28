INSERT INTO helo_users (username, MyPass, profile_pic)
VALUES
($1, $2, $3)
returning *