# 👋 Welcome!

Welcome to this Labspace focused on teaching you, in a hands-on way, about the various concepts of tools of Docker.

## 📋 Learning objectives

In this Labspace, you're going to gain familiarity with Docker and many of its core components. Specifically, you'll get to do the following:

- Learn about the role of containers and images
- Run containers and build images
- Learn about Docker's tooling, including Docker Compose, Testcontainers, and Scout
- Have fun along the way!

### What's _not_ in this overview?

The new AI-focused aspects of Docker's tooling will not be covered in this overview. That will be covered in another Labspace.

## 💻 App overview

The application we will be working with is Memes-R-Us, a fun website that simply displays memes and a welcome message.

Throughout this lab, you will be making changes to the application.

To start the app, complete the following steps:

1. If you have started VS Code yet in the panel to the right, click the **Load VS Code here** button.

2. In a terminal, install the Node dependencies by running the following command:

    ```sh
    npm install
    ```

3. Start the app by running the following command:

    ```sh
    npm run dev
    ```

    This is going to start the app in "dev mode", which means file changes will cause the app to automatically reload.

    Eventually, you should see the following output:

    ```plaintext
    Server is running on port 3000
    ```

4. Open your browser to http://localhost:3000. You should see the Memes-R-Us website!

## Next steps

Now that you have the site up and running and a few changes applied to it, we're ready for the next feature!
