# 🧩 Running tests... with containers!

More to come here soon!

## 🐳 Docker Recap

Before moving on, let's take a step back and focus on what we learned.

- **Ephemeral test environments.** We no longer need long-running test environments with databases and other services just for testing. We can spin them up when needed and then tear them down, saving on costs and maintenance.
- **No more resource contention.** Building on the previous notes, tests can now run in parallel as they spin up their own resources. No more waiting for another test suite to finish before the database can be used for the next test run.
- **Test consistency.** By using containers in testing, the tests run by developers on their local machines will run the same way as they do in their CI environments. No more "it worked on my machine" for testing!

## Next steps

Now that we've learned about development and testing, let's prepare our application for deployment by containerizing it!
