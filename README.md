## Container-supported development

This Labspace is designed to introduce users to the benefit of using containers in local development without having to go "all-in".

The goal is to use containers to run your databases, caches, message queues, and other external services. No install. No setup.

## Learning objectives

By the end of this Labspace, you will have learned the following:

- **No more install or dependency hell.** Containers make it easy to run your services. No more need to install databases, caches, message queues, or more.

- **Get your team up and going in seconds, not hours or days.** By including a Compose file in your repo, your team can simply `git clone` and `docker compose up`.

- **Look for additional dev tools.** With a containerized development environment, you can easily add visualizers, test interfaces, and more to your stack to enable faster troubleshooting and debugging.

## Launch the Labspace

To launch the Labspace, run the following command:

```bash
docker compose -f oci://dockersamples/labspace-container-supported-development up -d
```

And then open your browser to http://localhost:3030.

### Using the Docker Desktop extension

If you have the Labspace extension installed (`docker extension install dockersamples/labspace-extension` if not), you can also [click this link](https://open.docker.com/dashboard/extension-tab?extensionId=dockersamples/labspace-extension&location=dockersamples/labspace-container-supported-development&title=Container-supported%20development) to launch the Labspace.
