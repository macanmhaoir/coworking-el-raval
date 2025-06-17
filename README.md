# coworking-el-raval

rm -rf dist
mkdir dist
cp index.html dist/
cp -r images/ dist/

git add .
git commit -m "Updated website with new changes"
git push origin master
