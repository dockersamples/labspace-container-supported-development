# 🛠️ Adding dev tools

Before we talk about building and packaging our application as a container image, we want to show one additional capability of using containers for development - **the ease of adding additional tools.**

As we were working in the previous section, we had to use the `psql` command quite a bit. But, not everyone is familiar with `psql`.

What if we could add a web-based tool to make it easier to navigate and work with our database?

Fortunately, there is an open-source tool called [pgAdmin](https://www.pgadmin.org/) that ships a container image! Sweet!


## Adding pgAdmin to our stack

Since pgAdmin is already a containerized application, we can simply add it to our `compose.yaml`.

1. In the `compose.yaml` file, add the following configuration:

    ```yaml
    services:
      pgadmin:
        image: dpage/pgadmin4:9.6.0
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

    **NOTE:** If you copy the snippet above, remove the first `services` field.

    Looking at the `compose.yaml` file, you should now have a single `services` field with two defined services - `db` and `pgadmin`.

2. Use `docker compose` to update the running stack:

    ```bash
    docker compose up -d
    ```

    Note that we did NOT have to tear down the existing stack. Compose is smart enough to figure out what changes were made and automatically apply them.

3. Open your browser to http://localhost:5050. Note that it may take a moment for the app to startup. If you need to, you can check the logs by using `docker compose logs`:

    ```bash
    docker compose logs pgadmin
    ```

4. In the middle of the screen in the **Quick Links** section, click on the **Add New Server** link.

5. In the _General_ tab, enter a name of "Development".

6. In the _Connection_ tab, enter the following config:

    - **Host name/address**: db
    - **Password**: secret
    - **Save password?** Enable the toggle

7. Click the **Save** button.

8. To view the table content, use the left side nav (named **Object Explorer**) to navigate to **Servers** -> **Development** -> **Databases** -> **postgres** -> **Schemas** -> **public** -> **Tables** -> **memes**.

9. Right-click on the _memes_ table and select **View/Edit Data** -> **All Rows**.

If you'd like feel free to make any changes to the database you'd like!



### Auto-configuring pgAdmin

You may be thinking "Wow! This is cool, but I still had to do a few things to set everything up." And you're not wrong! It would be great to provide a seamless experience to our developers.

Many apps provide the ability to provide this configuration at startup, pgAdmin included. That configuration requires a few files to be defined, which go beyond the scope of this training. But, we can define them in our code base and mount them into the pgAdmin container, just as we did for the database containers.



## 🐳 Docker Recap

Before moving on, let's take a step back and focus on what we learned.

- 🎉 **No install required.** Just as with the database, we can add other containerized services without spending time on setup and configuration.
- 🎉 **More than just our app's needs.** While it's great to have our app's dependencies in the project, that's not the only thing that can be in our dev environments. 



## Next steps

Now that we've learned how to use containers to help setup our development environment and add additional tools, let's explore how containers can be used to help ensure our apps work as expected!
