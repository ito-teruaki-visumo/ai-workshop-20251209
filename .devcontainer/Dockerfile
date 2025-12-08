FROM node:24-bookworm

# Install build tooling and MySQL client for local debugging
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    pkg-config \
    default-mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Set user to node for better permissions
USER node
