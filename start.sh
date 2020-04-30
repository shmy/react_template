docker run --name sso-web -d -p 4001:80 \
-e BACKEND_URL=http://docker.for.mac.host.internal:4000 \
shmy/sso-web:latest
