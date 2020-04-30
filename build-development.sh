npm run build
rm -rf deploy/dist
mv dist deploy/dist
cd deploy
docker build -t shmy/sso-web:latest .
docker push shmy/sso-web:latest
#echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
#sudo apt-get update && sudo apt-get install sshpass -y
#sshpass -p $SSH_PASS ssh -o StrictHostKeyChecking=no root@47.75.55.94 "cd /home/sso && ./start_web.sh"
