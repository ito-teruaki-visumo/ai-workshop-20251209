FROM mcr.microsoft.com/devcontainers/javascript-node

# Install extra tooling (MySQL client, pkg-config, .NET SDK 8.0)
RUN apt-get update && apt-get install -y \
    default-mysql-client \
    pkg-config \
    && curl -sSL https://packages.microsoft.com/config/debian/12/packages-microsoft-prod.deb -o packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && rm packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y \
    dotnet-sdk-8.0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Set user to node for better permissions
USER node
