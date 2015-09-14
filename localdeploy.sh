TARGET_REPO=../oshiprod
TARGET_BASE=$TARGET_REPO/wwwroot
TARGET_CSS=$TARGET_BASE/css
TARGET_JS=$TARGET_BASE/js
SOURCE=./build


# First delete existing JS and CSS compiled files
rm $TARGET_CSS/*
rm $TARGET_JS/*

# Then commit the deletes
git commit -m "Removing old generated JS and CSS files for new deployment"

# Now copy our build structure over to the targets (replacing if required)
cp -Rf $SOURCE/* $TARGET_BASE

# Commit all changes
cd $TARGET_BASE
git add ./
git commit -m "New generated files for deployment"

# Job's a good'un
git push

