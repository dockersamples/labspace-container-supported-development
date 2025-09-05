# Running a containerized database

The Memes-R-Us website uses a PostgreSQL database to store the available memes. Therefore, to run the app in development, you will need a local database.

But, it's often not enough to have only a database, as you need a user to connect with, schemas, and initial data.

In this section, you will do the following:

1. Start a PostgreSQL database
2. Configure the application to connect to it
3. Write and share schema files to auto-populate the database

By the end of this section, you will have a working application!


> [!IMPORTANT]
> Getting started with containers can be daunting. For many developers, the easiest approach is to 
> start with the services their app depends on (databases, caches, etc.). 
>
> Later, if they decide to run the app itself in a container during development, they can certainly do so.



## ▶️ Starting the app

If you haven't done so, open the VS Code environment in the panel on the right.

> [!NOTE]
> All commands in this Labspace must run inside a terminal within the Labspace-provided VS Code editor.
>
> For convenience, you can press the Play button to run the command.

1. Install the Node dependencies by running the following command:

    ```bash
    npm install
    ```

2. Start the app by running the following command:

    ```bash
    npm run dev
    ```

    This will start the app using `nodemon`, which will automatically restart the app when changes are made.

3. Open your browser to http://localhost:3000. Instead of the app, you should see the following error:

    ```plaintext no-copy-button
    Error: connect ECONNREFUSED 127.0.0.1:5432
        at /home/coder/project/node_modules/pg-pool/index.js:45:11
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async getRandomMeme (/home/coder/project/src/db.js:12:17)
        at async /home/coder/project/src/index.js:17:22
    ```

    This error occurs because the app is trying to connect to the postgres database, which isn't running yet.

    Let's fix that!


## ▶️ Starting a PostgreSQL container

Containers allow you to simply run PostgreSQL. No installation required!

In order to run a container, you need a container image. Fortunately, there is an [official postgres](https://hub.docker.com/_/postgres) image.

1. Use the `docker run` command in a terminal to start a PostgreSQL container:

    ```bash terminal-id=labspace2
    docker run -d --name=postgres -p 5432:5432 -e POSTGRES_PASSWORD=secret postgres:17-alpine
    ```

   This command is using the following flags:

    - `-d` - run the container in "detached" mode. This runs the container in the background.
    - `--name postgres` - give this container a specific name. Normally, this flag is skipped and an auto-generated name is used. But, it helps in workshop settings.
    - `-p 5432:5432` - this "publishes" the port, allowing us to access the database running inside the container's isolated environment
    - `-e POSTGRES_PASSWORD=secret` - this container requires configuration to set the admin password. This flag sets that as an environment variable.
    - `postgres:17-alpine` - this is the name of the container image to run

    The output that you see is the full container ID.

2. To see a list of running containers, use the `docker ps` command:

    ```console
    docker ps
    ```

    After running the previous command, you should see output similar to the following:

    ```plaintext no-copy-button
    CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS         PORTS                                         NAMES
    6ca807b3208e   postgres:17-alpine   "docker-entrypoint.s…"   2 seconds ago   Up 2 seconds   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   postgres
    ```

    Hooray! It's running! 
    
    > [!IMPORTANT]
    > To emphasize, this single `docker run` command helps illustrate the power of a container. Containers make running things easy. **No installs. No setup. Just run.**

## 📞 Connect the app to the database

Now that the container is up and running, it's time to update the app to connect to it.

1. The app uses a `.env` file to configure the database settings. Create a `.env` file with the following content:

    ```dotenv save-as=.env
    PGHOST=localhost
    PGPORT=5432
    PGUSER=postgres
    PGPASSWORD=secret
    PGDATABASE=postgres
    ```

    This will tell the app to connect to `localhost:5432` (remember, we're exposing the container's port) and using the default username with the password we supplied.
    
2. With the database running and the app configured, the app should work, right? But, opening [the site](http://localhost:3000) now gives another error:

    ```plaintext
    error: relation "memes" does not exist
        at /home/coder/project/node_modules/pg-pool/index.js:45:11
        at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
        at async getRandomMeme (/home/coder/project/src/db.js:8:17)
        at async /home/coder/project/src/index.js:18:22
    ```

    You're getting this error because the required tables aren't in the database.


## ➕ Populating the database

Docker's database container images provide the ability to load "seed" files into the container during first launch, making it easy to create tables and provide data at startup.

In the following steps, you are going to create the schema files and provide them to the database container using a feature called [bind mounts](https://docs.docker.com/engine/storage/bind-mounts/).

1. In the project, create a folder named `db`. You can either do so using the IDE directly or by running the following command:

    ```bash
    mkdir db
    ```

2. In the `db` folder, create a file named `01-create-schema.sql` with the following contents:

    ```sql save-as=db/01-create-schema.sql
    CREATE TABLE memes (
        "id" SERIAL NOT NULL PRIMARY KEY,
        "url" varchar(255) NOT NULL,
        "creation_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    ```

    This will create a table named `memes` with three columns - the ID of the meme, its URL, and a creation timestamp.

3. In the `db` folder, create a file named `02-initial-data.sql` with the following contents:

    ```sql save-as=db/02-initial-data.sql
    INSERT INTO memes (url) VALUES 
        ('https://media.giphy.com/media/FaKV1cVKlVRxC/giphy.gif'),
        ('https://media.giphy.com/media/CAmbqvnwDk4jAqnLg9/giphy.gif'),
        ('https://media.giphy.com/media/6AFldi5xJQYIo/giphy.gif');
    ```

    This will insert three memes into the table, specifying only the URLs. The ID and creation timestamps are automatically generated by the database.

4. Bind mounts can't be added to a container after it's been started. Therefore, you'll need to restart the container. First remove the existing container with the `docker rm` command:

    ```bash
    docker rm -f postgres
    ```

    The `-f` flag will stop the database before removing the container.

5. Use the following command to share the schema files from your workspace into the container with a bind mount:

    ```bash
    docker run -d --name=postgres \
        -p 5432:5432 \
        -v ./db:/docker-entrypoint-initdb.d \
        -e POSTGRES_PASSWORD=secret \
        postgres:17-alpine
    ```

    This command adds the `-v ./db:docker-entrypoint-initdb.d` flag to specify the bind mount. This causes Docker to share the local `./db` directory into the container at `/docker-entrypoint-initdb.d`.

    The `/docker-entrypoint-initdb.d` directory is a special directory the container inspects when starting up. If there are files there, it'll automatically import them into the database.

6. Once the container is running, confirm the data exists in the database, use the following `psql` command:

    ```bash
    psql -h localhost -U postgres -c "SELECT * FROM memes"
    ```

    After entering the password (which is `secret`), you should see output similar to the following:

    ```plaintext no-copy-button
      id |                            url                            | creation_date 
    ----+------------------------------------------------------------+---------------
      1 | https://media.giphy.com/media/FaKV1cVKlVRxC/giphy.gif.     | 2025-08-19
      2 | https://media.giphy.com/media/CAmbqvnwDk4jAqnLg9/giphy.gif | 2025-08-19
      3 | https://media.giphy.com/media/6AFldi5xJQYIo/giphy.gif      | 2025-08-19
    (3 rows)
    ```

    Hooray! The database is populated and ready to go!

4. Go back to the app (at http://localhost:3000) and validate it works now.




## 🐳 Docker Recap

Before moving on, let's take a step back and focus on what we learned.

- 🎉 **No install required.** PostgreSQL is running in a container with minimal effort or setup required. Even with database schema setup!
    - Docker provides many options to configure and troubleshoot containers
- 🎉 **Compose makes things easy.** If we add the Compose file to our repo, other team members only need to `git clone` and run `docker compose up`. Everything will be there for them.
    - Everyone is on the same version of the database. If a new version comes out, we only need to update the Compose file and everyone will be updated.


## Next steps

Now that you've added a containerized service, let's add one more capability to our dev environment to make it easier for developers... troubleshooting and debugging tools!
