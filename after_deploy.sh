git clone https://${GH_TOKEN}@github.com/voiceittech/voiceit2-nodejs.git $HOME/voiceit2nodejs-gm
git config --global user.email "andrew@voiceit.io"
git config --global user.name "voiceitbot"
cp package.json $HOME/voiceit2nodejs-gm/
cd $HOME/voiceit2nodejs-gm
git add package.json
git commit -m "Updated Version"
git push origin master
