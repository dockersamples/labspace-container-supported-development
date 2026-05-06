# 🛠️ Adding dev tools

**Pro tip:** Containers in your dev stack don't have to be just for the app or services you're relying on. Containers make it easy to add additional tools.

Recognizing not every developer is a PostgreSQL expert, you are going to add a [pgAdmin](https://hub.docker.com/r/dpage/pgadmin/) container to help visualize the database.


## ➕ Adding pgAdmin to your stack

Since you already have a `compose.yaml` file, you only need to add a new service to define a second container.

1. In the `compose.yaml` file, add the following configuration:

    ```yaml
    services:
      pgadmin:
        image: dpage/pgadmin4:9.14.0
        ports:
          - 5050:80
        environment:
          PGADMIN_DEFAULT_EMAIL: demo@example.com
          PGADMIN_DEFAULT_PASSWORD: secret
          PGADMIN_CONFIG_SERVER_MODE: 'False'
          PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED: 'False'
        depends_on:
          - db
    ```

    > [!NOTE]
    > If you copy the snippet above, remove the first line (the `services` field) as it already exists in your file.

    Looking at the `compose.yaml` file, you should now have a single `services` field with two defined services - `db` and `pgadmin`.

2. Use `docker compose` to update the running stack:

    ```bash terminal-id=labspace2
    docker compose up -d
    ```

    > [!TIP]
    > Note that you do not have to run `docker compose down` in order to apply changes. Compose is smart enough to figure out what changes were made and automatically apply them.

3. Open your browser to http://localhost:5050. Note that it may take a moment for the app to startup. If you need to, you can check the logs by using `docker compose logs`:

    ```bash terminal-id=labspace2
    docker compose logs pgadmin
    ```



## 👀 Visualizing the database

Now that pgAdmin is up and running, you can use it to view the data and make changes.

1. In the middle of the pgAdmin landing page, in the **Quick Links** section, click on the **Add New Server** link.

2. In the _General_ tab, enter a name of "Development".

3. In the _Connection_ tab, enter the following config:

    - **Host name/address**: db
    - **Password**: secret
    - **Save password?** Enable the toggle

4. Click the **Save** button.

5. To view the table content, use the left side nav (named **Object Explorer**) to navigate to **Servers** -> **Development** -> **Databases** -> **postgres** -> **Schemas** -> **public** -> **Tables** -> **memes**.

6. Right-click on the _memes_ table and select **View/Edit Data** -> **All Rows**.

If you'd like feel free to make any changes to the database you'd like!



### Auto-configuring pgAdmin

You may be thinking "Wow! This is cool, but I still had to do a few things to set everything up." And you're not wrong! It would be great to provide a seamless experience to our developers.

Many apps provide the ability to provide this configuration at startup, pgAdmin included. That configuration requires a few files to be defined, which you can do with Compose.

[Compose config files](https://docs.docker.com/reference/compose-file/configs/) provide the ability to inject files into a container, most often used for configuration.

To configure pgAdmin, you need to define a `servers.json` file that provides the configuration for the database server and then a `pgpass` file that provides the credentials.

1. In the `compose.yaml` file, add the following to define the a config file named `pgadmin-server-config:

    ```yaml
    configs:
      pgadmin-server-config:
        content: |
          {
            "Servers": {
              "1": {
                "Name": "Local Postgres",
                "Group": "Servers",
                "Host": "db",
                "Port": 5432,
                "MaintenanceDB": "postgres",
                "Username": "postgres",
                "PassFile": "/config/pgpass"
              }
            }
          }
    ```

2. Add a second config file to provide the contents of the `pgpass` file for pgAdmin to use:

    ```yaml
    configs:
      pgadmin-pgpass:
        content: |
          db:5432:*:postgres:secret
    ```

3. Update the `pgadmin` service to inject the config files:

    ```yaml
    services:
      pgadmin:
        ...
        configs:
          - source: pgadmin-server-config
            target: /pgadmin4/servers.json
            mode: 0444
          - source: pgadmin-pgpass
            target: /config/pgpass
            uid: "5050"
            gid: "5050"
            mode: 0400
    ```

4. To prove everything works from a clean slate, first tear down the stack:

    ```bash terminal-id=labspace2
    docker compose down
    ```

    And then restart it:

    ```bash terminal-id=labspace2
    docker compose up -d
    ```

    Once pgAdmin starts up, you should be able to open [http://localhost:5050](http://localhost:5050) the database immediately without needing to do any pre-configuration!
