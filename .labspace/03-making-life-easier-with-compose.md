# Making life easier with Compose

Hopefully, you're starting to see how Docker makes it easy to run services. No need to install anything. Very simple configuration. It just works!

While sharing a `docker run` command with your team isn't challenging, things can get complicated very quickly if you have multiple services to run.

That's where Docker Compose comes in! With Compose, you can create a `compose.yaml` that defines your container stack and launch it with a single command.

> [!IMPORTANT]
> By using a Compose file, teams can easily define and share their dev setup. Simply `git clone` and `docker compose up` to get started!

## 🐳 Writing the Compose file

1. Since you will be launching the containers using Compose, go ahead and remove the container first:

    ```bash
    docker rm -f postgres
    ```

2. At the root of the project, create a file named `compose.yaml` with the following contents:

    ```yaml save-as=compose.yaml
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

    You might recognize this has almost all of the same config from the previous `docker run` command, but just in a different format.

## ▶️ Launch the stack

Now that you have the Compose file, it's time to start it up!

1. Start the database by using the `docker compose up` command:

    ```bash
    docker compose up -d
    ```

    The `-d` will run everything in the background. But, you should see output indicating the containers have started:

    ```plaintext no-copy-button
    [+] Running 2/2
    ✔ Network project_default  Created            0.0s 
    ✔ Container project-db-1   Started            0.2s 
    ```

2. If you want to view the logs for the containers, use the `docker compose logs` command:

    ```bash
    docker compose logs
    ```

    You'll notice the log output includes an indicator for the container that's producing the output (`db-1` in this case). This is incredibly helpful if you have multiple containers outputting logs at the same time.

    ```plaintext no-copy-button
    db-1  | The files belonging to this database system will be owned by user "postgres".
    db-1  | This user must also own the server process.
    db-1  | 
    db-1  | The database cluster will be initialized with locale "en_US.utf8".
    ```

    > [!TIP]
    > You can add the `-f` flag to "follow" the logs, allowing you to stream the log output as it's being generated.

3. Open your app (at [http://localhost:3000](http://localhost:3000)) and validate it still works.

