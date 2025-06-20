# Base image for building
ARG LITELLM_BUILD_IMAGE=cgr.dev/chainguard/python:latest-dev

# Runtime image
ARG LITELLM_RUNTIME_IMAGE=cgr.dev/chainguard/python:latest-dev
# Builder stage
FROM $LITELLM_BUILD_IMAGE AS builder

# Set the working directory to /app
WORKDIR /app

USER root

# Install build dependencies
RUN apk add --no-cache gcc python3-dev openssl openssl-dev

RUN pip install --upgrade pip && \
    pip install build

# Copy the current directory contents into the container at /app
# TODO: only copy what's necessary
COPY . .

# Build the package
RUN rm -rf dist/* && python -m build

# Runtime stage
FROM $LITELLM_RUNTIME_IMAGE AS runtime

# Ensure runtime stage runs as root
USER root

# Install runtime dependencies
RUN apk add --no-cache openssl tzdata

WORKDIR /app

# install dependencies
COPY ./requirements.txt ./requirements.txt
RUN pip install -r requirements.txt --no-cache-dir

# generate prisma client
COPY ./schema.prisma ./schema.prisma
RUN prisma generate

# install wheels from builder stage
COPY --from=builder /app/dist/*.whl .
RUN pip install *.whl && rm -f *.whl

COPY ./docker ./docker
RUN chmod +x docker/entrypoint.sh
RUN chmod +x docker/prod_entrypoint.sh

# copy runtime files
COPY custom_sso.py .

ARG CONFIG_FILE=config.yaml
COPY $CONFIG_FILE /app/config.yaml

ARG GIT_COMMIT=UNKNOWN
ENV GIT_COMMIT=$GIT_COMMIT
RUN echo "GIT_COMMIT: ${GIT_COMMIT}"

EXPOSE 4000/tcp

ENTRYPOINT ["docker/prod_entrypoint.sh"]

# Append "--detailed_debug" to the end of CMD to view detailed debug logs
CMD ["--port", "4000"]
