# 🔨 Building and pushing an image

So far, we've experienced the "it just works" capabilities of containers. The same can be true for our own apps too!

By running our apps in containers, we know they're going to work the same way anywhere there is a container engine. It'll just work!

To do this, we need to write a `Dockerfile`.



## Writing a Dockerfile

**NOTE:** With the Docker AI Agent, you can run the following command to create a Dockerfile. The AI features are not yet supported in Labspaces. But, stay tuned!

```bash
docker ai "Containerize this project for me"
```

But, since we can't run that in the Labspace, we'll create a Dockerfile manually.

1. Create a file at the root of the project called `Dockerfile`.

2. The first step when building an image is to determine what are we basing from - what are we extending/building on top of?

    Since this project is a Node-based project, we can use the [Docker Official Node image](https://hub.docker.com/_/node).

    ```dockerfile
    FROM node:lts-slim
    ```

    The `:lts-slim` portion is called a "tag". Think of it like the "version" we want to use. In this case, we are indicating we want to use the "LTS" (Long-Term Support) version and a slimmed version of it.

3. The next step is often to specify our "working directory." Where do we want to add files and run commands inside this new image?

    ```dockerfile
    WORKDIR /usr/local/app
    ```

    The path can vary depending on teams, orgs, and companies. There's no one universal "right" path.

4. Next, let's install our app's dependencies. We'll do so by copying in the files that define our dependencies and then running the command to install them:

    ```dockerfile
    COPY package*.json ./
    RUN npm ci --production
    ```

5. Finally, we'll copy in our app source code and set a few environment variables to have the app run in a "production" mode (these variables vary depending on the languages and frameworks being used).

    ```dockerfile
    ENV NODE_ENV=production
    COPY src/ ./src/
    ```

6. Finally, we're going to add some configuration to specify how a container using this image should run by default - what's the default command and what port does it want to use?

    ```dockerfile
    EXPOSE 3000
    CMD ["node", "src/index.js"]
    ```

Your Dockerfile should now look like this:

```dockerfile
FROM node:lts-slim
WORKDIR /usr/local/app
COPY package*.json ./
RUN npm ci --production
ENV NODE_ENV=production
COPY src/ ./src/
EXPOSE 3000
CMD ["node", "src/index.js"]
```


## Building the image

Now that we have a Dockerfile, let's build it and push it to Docker Hub!

1. Before moving forward, login with your Docker account by running the following command following the instructions:

    ```console
    docker login
    ```

2. Run the following to set an environment variable with your username:

    ```bash
    DOCKER_USERNAME=$(jq -r '.auths["https://index.docker.io/v1/"].auth' ~/.docker/config.json | base64 -d | cut -d: -f1); echo "Logged in as $DOCKER_USERNAME"
    ```

3. You're ready to build your image now. Build the container image using the following `docker build` command:

    ```bash
    docker build -t $DOCKER_USERNAME/memes-r-us --sbom=true --provenance=mode=max --load .
    ```

    The `--sbom=true` and `--provenance=mode=max` flags tell the builder to automatically create a SBOM (Software Bill of Materials) and build provenance. These are helpful to document both what's in the image and how it was built.

    **NOTE:** The `--load` flag will "load" the image into the local container image store. This is only required because we're doing the build in a Labspace environment. If running directly on your machine, it'll load automatically.

4. As of right now, the image is only available locally on your machine. To push the image, we can use the `docker push` command:

   ```bash
   docker push $DOCKER_USERNAME/memes-r-us
   ```

That's it! Or is it? Well, our image is built and pushed, but did we build a _good_ image? We'll talk about that in the next step!



## 🐳 Docker Recap

Before moving on, let's take a step back and focus on what we learned.

- **We build images using a Dockerfile.** The Dockerfile provides the instruction set on how to build container images.
- **The Docker AI tooling can help write that Dockerfile.** Since writing a Dockerfile can be tricky, the Docker AI Agent can make this process easier by analyzing the project and creating a Dockerfile for us, following current best practices.

While we didn't talk about it here, Docker Offload and Docker Build Cloud can be used to delegate our builds to cloud-based infrastructure to allow our builds to run faster by accessing stronger machines and a consistent build cache.

## Next steps

Now that we have an image, we want to explore the question of "did we build a _good_ image?". To do this, we'll leverage Docker Scout and explore Docker Hardened Images!
