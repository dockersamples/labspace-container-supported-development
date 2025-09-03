# Recap

Hooray! You have now finished this Labspace! Before closing out, a few takeaways to remember:

1. **No more install or dependency hell.** Containers make it easy to run your services. No more need to install databases, caches, message queues, or more.

2. **Get your team up and going in seconds, not hours or days.** By including a Compose file in your repo, your team can simply `git clone` and `docker compose up`.

3. **Look for additional dev tools.** With a containerized development environment, you can easily add visualizers, test interfaces, and more to your stack to enable faster troubleshooting and debugging.

## Additional resources

The following resources can help you learn more about using containers for local development and testing.

### Guides on Docker Docs

- [Mocking API services with WireMock](https://docs.docker.com/guides/wiremock/) - mock your external API services rather than directly depending on them in development
- [Develop and test AWS Cloud applications using LocalStack](https://docs.docker.com/guides/localstack/) - develop and test against AWS services without needing an AWS account
- [Developing event-drive applications with Kafka and Docker](https://docs.docker.com/guides/kafka/) - develop and test with a containerized Kafka instance
- [Mocking OAuth services in testing with Dex](https://docs.docker.com/guides/dex/) - decouple development from remote OAuth providers without swapping your auth mechanisms
