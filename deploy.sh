echo "switching to brand master"
git checkout main

echo "Building app ..."
npm run build

echo "Deploying files to server..."
scp -r dist/* root@82.165.239.219:/var/www/mamdal/admin

echo "Done!"