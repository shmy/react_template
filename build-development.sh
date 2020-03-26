npm run build
mv dist deploy/dist
cd deploy
docker build -t shmy/sso-web .
echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
docker push shmy/sso-web:latest
sudo apt-get update && sudo apt-get install sshpass -y
sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no root@47.75.55.94 "cd /home/sso && ./start_web.sh"
