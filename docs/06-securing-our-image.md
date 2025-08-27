# 🔐 Securing our image

In the last section, we created a container image. But, did we create a _good_ container image?

## What defines a good image?

The definition for a good image will vary by team, organization, and company. But, most will agree that the following criteria apply:

- **Minimal vulnerabilities.** Ideally, there will be _no_ critical or high vulnerabilities. Others are kept to a minimum.
- **Trusted image sources.** The base images (those specified in the `FROM` statement) are trusted and authorized base images
- **Non-root users by default.** When a container starts, is it going to run as a non-root user? Doing so helps minimize issues if a compromise occurs.
- **Open-source license issues.** When using open-source libraries, the associated licenses can sometimes cause complications when used in enterprise settings. Keeping track of these is important.



## 🔍 Analyzing our image

With Docker Scout, we can easily analyze our image using the policies specified by organization.

1. If you are part of an organization, run the following command, replacing "ORGANIZATION' with the name of your org:

    ```bash
    docker scout config organization ORGANIZATION
    ```

2. Use `docker scout quickview` to perform a quick analysis of your container image:

    ```bash
    docker scout quickview $DOCKER_USERNAME/memes-r-us
    ```

    In the analysis procedure, you should see indications that the SBOM and provenance were "found", meaning they were attached to the image.

    If you have an organization configured, you're likely to see output similar to the following:

    ```plaintext no-copy-button
    Policy status  FAILED  (6/7 policies met)

      Status │                   Policy                    │           Results            
    ─────────┼─────────────────────────────────────────────┼──────────────────────────────
      !      │ No default non-root user found              │                              
      ✓      │ No AGPL v3 licenses                         │    0 packages                
      ✓      │ No fixable critical or high vulnerabilities │    0C     0H     0M     0L   
      ✓      │ No high-profile vulnerabilities             │    0C     0H     0M     0L   
      ✓      │ No outdated base images                     │                              
      ✓      │ No unapproved base images                   │    0 deviations              
      ✓      │ Supply chain attestations                   │    0 deviations          
      ```

      This is highlighting that we do not have a non-root user by default. Let's fix that!

3. In your `Dockerfile`, add the following before the `EXPOSE` statement:

    ```dockerfile
    RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
    USER appuser
    ```

4. Perform a new build using the following command:

    ```bash
    docker build -t $DOCKER_USERNAME/memes-r-us:updated --sbom=true --provenance=mode=max --load .
    ```

5. Perform an analysis of the newly built image:

    ```bash
    docker scout quickview $DOCKER_USERNAME/memes-r-us:updated
    ```

    The output should now show:

    ```plaintext no-copy-button
    Policy status  SUCCESS  (7/7 policies met)
    ```

    Hooray! 🎉



## 🔐 Docker Hardened Images

While our image is now compliant, we still run the risk of new vulnerabilities being discovered. How can we remediate them as quickly as possible? And can we use base images that are slimmer to further reduce that risk?

Docker Hardened Images provide near-zero CVE base images that help produce up to 95% smaller images and come with enterprise-grade SLAs for rapid remediation.

Fortunately, migrating to them isn't that difficult!

One adjustment is that the "prod" version of an image doesn't include the tools required to install packages and other dependencies. Therefore, we need to use a multi-stage approach.

Our previous Dockerfile, after being migrated, will look like this:

```dockerfile
# === Build stage: Install dependencies ===
FROM docker/dhi-node:24-alpine3.22-dev AS builder

WORKDIR /usr/local/app
COPY package*.json ./
RUN npm ci --production

# === Runtime stage: Minimal image ===
FROM docker/dhi-node:24-alpine3.22

WORKDIR /usr/local/app
ENV NODE_ENV=production

COPY --from=builder /usr/local/app/node_modules ./node_modules
COPY src/ ./src/
EXPOSE 3000
CMD ["src/index.js"]
```

## 🐳 Docker Recap

Let's take a step back and focus on what we learned.

- **Docker makes image analysis easy with Scout.** With Scout, developers have the tools required to analysis container images, identify issues, and receive guidance on how to fix the issues they are facing.
- **Docker Hardened Images provide enterprise-grade base images.** With Docker Hardened Images, enterprises can ensure they are building their images from solid foundations.
