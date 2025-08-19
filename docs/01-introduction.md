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



## 🐳 Your first change

**CHANGE REQUEST INCOMING!** We need to update the website to use a different title, image, and colors. Fortunately, it is up to you to determine what title, image, and colors to use.

Let's get to it! 🏃

### Updating the title

1. Open the `src/index.js` file in the VS Code editor.

2. Find the line that looks like the following:

    ```javascript
    message: "Whalecome to Docker!",
    ```

    This line is specifying the message to be displayed on the website. Since it's something we need to update, let's update it!

3. Update the message to whatever you'd like. For example, this would change the message to "Good day to you!":

    ```javascript
    message: "Good day to you!",
    ```

    Make sure you keep the surrounding `"` marks and the comma at the end.

4. Go back to your website (http://localhost:3000) and refresh the page. Validate the change worked. Hooray! 🎉

### Updating the image

1. Now, find the following line in the `src/index.js` file:

    ```javascript
    memeUrl: "https://media.giphy.com/media/yoJC2A59OCZHs1LXvW/giphy.gif"
    ```

    This is specifying the location of the image to display for our meme. Let's update that!

2. Open [giphy.com](https://giphy.com) and find an image you'd like.

3. Click the "chain link" icon to copy the URL. And then paste it in, replacing the URL that was there before.

    The following update would change the image to use a different whale meme:

    ```javascript
    memeUrl: "https://media.giphy.com/media/CAmbqvnwDk4jAqnLg9/giphy.gif"
    ```

4. Go back to your page and refresh the page to validate it worked.

### Updating the color palette

1. Open the `src/assets/styles.css` file in the VS Code editor.

2. Update the `background-color` attributes for the `body` and `#content` sections.

    - The `body` update will change the entire page background
    - The `#content` update will change the background color for only the card displaying the image and title

3. Go back to your page and refresh the page to validate the changes worked.


Phew! Our website has been updated!

## Next steps

Now that you have the site up and running and a few changes applied to it, we're ready for the next feature!
