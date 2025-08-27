# Adding containerized services

Our application is fairly simple right now. It has no backing database or other services it depends on. Rarely are apps this independent.

Fortunately, a change request has just come in!

> **CHANGE REQUEST INCOMING!** We would like to be able to update the memes displayed on the website without having to update code and redeploy the app. Also, if we get massive traffic, we want to ensure every instance of the app is using the same collection of images.


## 🙋 Breaking down the request

With a request like this, there are then a lot of follow-up questions that will likely come up, such as:

- Do we need an admin interface to manage the memes?
- How should the memes be defined? Do we use a database? If so, which technology? If not, how will apps get the updated config?
- Who should be able to update the available memes?

Fortunately, our Product and Engineering Leads decided on the following:

1. No. We do not need an admin interface. Direct database updates are fine for now. Let's just get something out as quickly as possible.
2. Let's go ahead and use a database, as that's easy to deploy. Since we use PostgreSQL in other apps, we'll go with that.

So, the big questions are now... 

- How do we get everyone's development environment updated to have a database? 
- How do we ensure everyone is using the same version of the database?
- How can we provide tooling to help folks interact with the database?

Short answer... enter Docker and containers! 🐳 📦

## Starting PostgreSQL

Running a PostgreSQL database in a container isn't too difficult.

1. Use the `docker run` command in a terminal to start a PostgreSQL container:

    ```bash
    docker run -d --name=postgres postgres:17-alpine
    ```

   This command is using the following flags:

    - `-d` - run the container in "detached" mode. This runs the container in the background.
    - `--name postgres` - give this container a specific name. Normally, this flag is skipped and an auto-generated name is used. But, it helps in workshops.
    - `postgres:17-alpine` - this is the name of the container image to run

    The output that you see is the full container ID.

2. To view the running containers, you use the `docker ps` command:

    ```console
    docker ps
    ```

    After running the previous command, you should see output similar to the following:

    ```plaintext no-copy-button
    CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
    ```

    Where is the container we just ran? Maybe it didn't start successfully?

3. View all containers, even those that are no longer running, by adding the `-a` flag to the command:

    ```console
    docker ps -a
    ```
   
    With that, you should now see output similar to the following:

    ```plaintext no-copy-button
    CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS                     PORTS     NAMES
    f8c7b5660668   postgres:17-alpine   "docker-entrypoint.s…"   2 seconds ago   Exited (1) 2 seconds ago             postgres
    ```

    There it is! As we thought, the container did fail to start (per the `STATUS` column). Let's see if we can figure out what's going on.

4. View the logs of the container by using the `docker logs` command:

    ```console
    docker logs postgres
    ```
   
    The `docker logs` command requires either the name of a container or the ID. Since we previously named the container `postgres`, we were able to reference it with that name here.

    In the log output, you should see something similar to the following:

    ```plaintext no-copy-button
   Error: Database is uninitialized and superuser password is not specified.
       You must specify POSTGRES_PASSWORD to a non-empty value for the
       superuser. For example, "-e POSTGRES_PASSWORD=password" on "docker run".

       You may also use "POSTGRES_HOST_AUTH_METHOD=trust" to allow all
       connections without a password. This is *not* recommended.

       See PostgreSQL documentation about "trust":
       https://www.postgresql.org/docs/current/auth-trust.html
    ```

    This error message is telling us that the container requires the definition of an environment variable named `POSTGRES_PASSWORD`.

5. Since we can't modify the environment variables for an existing container, we will have to create a new one. Use the following command to create a new container, but this time with the required variable:

    ```console
    docker run -d --name=postgres -e POSTGRES_PASSWORD=secret postgres:17-alpine
    ```
   
    When you run this command, you will get an error that looks similar to the following:

    ```plaintext no-copy-button
    docker: Error response from daemon: Conflict. The container name "/postgres" is already in use by container "f8c7b5660668324140f773b0a54a723bfe069a4d71ba231ca2ec8c4f33ddd314". You have to remove (or rename) that container to be able to reuse that name.
    ```

    We got this because we tried to use the same name as the previous container and names must be unique. This is why we generally don't specify names for our containers.

6. Remove the previous container using the `docker rm` command:

    ```console
    docker rm postgres
    ```
   
7. Run the previous command again to start our database container:

    ```console
    docker run -d --name=postgres -e POSTGRES_PASSWORD=secret postgres:17-alpine
    ```
   
    This time, it should stay up and running! Hooray!


## Exposing PostgreSQL

Now that we have a database running, let's try to connect our application to it. 

1. Before connecting our app, we can validate the connection by using the `psql` tool. Run the following command to connect to the database:

    ```console
    psql -h localhost -U postgres
    ```

    Unfortunately, we're not able to connect. That's because we didn't _publish_ the container's database port - it's running only in its isolated environment.

2. Stop the container by running the following command:

    ```bash
    docker rm -f postgres
    ```

    The `-f` flag will stop the container first and then remove it.

3. Let's start a new container, but this time adding the `-p` flag to "publish" the port. This basically punches a hole through the network isolation to allow us to connect to the database. Run this command to do so:

    ```bash
    docker run -d --name=postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:17-alpine
    ```

4. Now, try to connect to the database using `psql`:

    ```bash
    psql -h localhost -U postgres
    ```

    When you're prompted for the password, enter the password we defined in the command:

    ```bash
    secret
    ```

    You should now be connected! It worked! 🎉

5. Disconnect from the database by running the following command from inside the `psql` tool:

    ```bash
    \q
    ```


## ➕ Populating the database

Having a database is great, but it needs tables and data to actually be useful. How do we create those tables and populate initial data?

With Docker's database images, we can load "seed" files into the container and have it automatically create tables and provide data.

Let's give it a try! We'll create the schema files and then update our database to have them.

1. In our project, create a folder named `db`. You can either do so using the IDE directly or by running the following command:

    ```bash
    mkdir db
    ```

2. In the `db` folder, create a file named `01-create-schema.sql` with the following contents:

    ```sql
    CREATE TABLE memes (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "url" varchar(255) NOT NULL,
        "creation_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    ```

    This will create a simple table named `memes` that will have three columns - the ID of the meme, its URL, and a timestamp for when it was created.

3. In the `db` folder, create a file named `02-initial-data.sql` with the following contents:

    ```sql
    INSERT INTO memes (url) VALUES 
        ('https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif'),
        ('https://media.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif'),
        ('https://media.giphy.com/media/14hs7g86sQqDF6/giphy.gif');
    ```

    This will insert three memes into the table, specifying only the URLs. The ID and creation timestamps are automatically generated for us by the database.

4. Let's update the database to use these files. First, remove the current database container:

    ```bash
    docker rm -f postgres
    ```

5. Use the following command to share the schema files from our workspace into the container (this is called bind mounting):

    ```bash
    docker run -d --name=postgres \
        -p 5432:5432 \
        -v ./db:/docker-entrypoint-initdb.d \
        -e POSTGRES_PASSWORD=secret \
        postgres:17-alpine
    ```

6. Use the following `psql` command to validate the table exists and the data is there now:

    ```bash
    psql -h localhost -U postgres -c "SELECT * FROM memes"
    ```

    After entering the password (`secret`), you should see output similar to the following:

    ```plaintext no-copy-button
      id |                            url                            | creation_date 
    ----+------------------------------------------------------------+---------------
      1 | https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif | 2025-08-19
      2 | https://media.giphy.com/media/IwAZ6dvvvaTtdI8SD5/giphy.gif | 2025-08-19
      3 | https://media.giphy.com/media/14hs7g86sQqDF6/giphy.gif     | 2025-08-19
    (3 rows)
    ```

Hooray! The database is populated and ready to go!


## 💻 Updating the app to use the database

1. In order to connect to the PostgreSQL database, we need code that can communicate to the database. Fortunately, we can use the [pg library](https://www.npmjs.com/package/pg). Install it by running the following command:

    ```bash
    npm add pg
    ```

2. In the `src` folder, create a file named `db.js` with the following contents:

    ```javascript
    const { Pool } = require('pg');

    const pool = new Pool({
        user: process.env.PGUSER || "postgres",
        password: process.env.PGPASSWORD || "secret",
        host: process.env.PGHOST || "localhost",
        port: process.env.PGPORT || 5432,
        database: process.env.PGDATABASE || "postgres"
    });

    async function getRandomMeme() {
        const res = await pool.query('SELECT url FROM memes ORDER BY RANDOM() LIMIT 1');
        return res.rows[0]?.url || "https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif";
    }

    module.exports = {
        getRandomMeme
    };
    ```

    This will provide the code required to connect to the database and get a random meme url.

3. With the database code, we only need to update our website to use it. In the `src/index.js` file, add the following to the top of the file:

    ```javascript
    const { getRandomMeme } = require("./db");
    ```

    This gives us access to the `getRandomMeme` function we defined in the other file.

4. Now, we only need to update our web page to use a meme URL that we get from the database. Update the `memeUrl` section to the following:

    ```javascript
    memeUrl: await getRandomMeme(),
    ```

5. Refresh your page. You should now see the memes defined in the database! 🎉

## 🐳 Using Compose to make the services easier to start

Hopefully, you're starting to see how Docker makes it easy to run services. No need to install anything. Very simple configuration. It just works!

But, if your app starts to have quite a few services, telling team members to run a bunch of `docker run` commands is a lot of work.

That's where Docker Compose comes in! With Compose, we can create a `compose.yaml` that defines everything for us.

1. Before we define the Compose file, let's remove the database container we already have running:

    ```bash
    docker rm -f postgres
    ```

2. At the root of the project, create a file named `compose.yaml` with the following contents:

    ```yaml
    services:
      db:
        image: postgres:17-alpine
        ports:
          - 5432:5432
        volumes:
          - ./db:/docker-entrypoint-initdb.d
        environment:
          POSTGRES_PASSWORD: secret
    ```

    You should probably recognize this has almost all of the same config from the previous `docker run` commands, but just in a different format.

3. Start the app now by using `docker compose`:

    ```bash
    docker compose up -d
    ```

    The `-d` will run everything in the background. But, you should see output indicating the containers have started:

    ```plaintext no-copy-button
    [+] Running 2/2
    ✔ Network project_default  Created            0.0s 
    ✔ Container project-db-1   Started            0.2s 
    ```

4. To prove it's working, run the following commands to delete all of the memes in the database and then add a new one:

    ```bash
    psql -h localhost -U postgres -c "DELETE FROM memes"
    ```

    And add another one into the database:

    ```bash
    psql -h localhost -U postgres -c "INSERT INTO memes (url) VALUES ('https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif')"
    ```

5. Refresh the browser several times and you should only see a single celebratory meme.

## 🐳 Docker Recap

Before moving on, let's take a step back and focus on what we learned.

- 🎉 **No install required.** PostgreSQL is running in a container with minimal effort or setup required. Even with database schema setup!
    - Docker provides many options to configure and troubleshoot containers
- 🎉 **Compose makes things easy.** If we add the Compose file to our repo, other team members only need to `git clone` and run `docker compose up`. Everything will be there for them.
    - Everyone is on the same version of the database. If a new version comes out, we only need to update the Compose file and everyone will be updated.


## Next steps

Now that you've added a containerized service, let's add one more capability to our dev environment to make it easier for developers... troubleshooting and debugging tools!
