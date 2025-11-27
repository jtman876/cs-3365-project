# cs-3365-project

## Installation

Install [git](https://git-scm.com/) if you haven't already.

Install [npm](https://www.npmjs.com/) if you haven't already.
```sh
winget install -e --id OpenJS.NodeJS
```

Download the project.
```sh
git clone https://github.com/jtman876/cs-3365-project.git
cd cs-3365-project
```

Download dependencies
```sh
npm install
```

## Making Changes

Get the latest changes before you start making your own additions.
```sh
# Get latest changes
git checkout master
git pull origin master

# Create a new branch
git checkout -b feature/<your-feature>

# Start web server
npm start
```

When you're finished, save your changes.
```sh
git add .
git commit -m "<description of your changes>"
git push -u origin feature/<your-feature>
```

> Note: If you get latest changes with `git pull origin master` while on your feature branch, you will need to resolve any conflicts between your code and the new code.

## Submit Changes
Once your feature is complete, you can make a pull request to merge your changes with the master branch.
1. Go to the **Pull Requests** tab on GitHub.
2. Click on **New Pull Request**. 
3. Select your branch and compare it to master.
4. Add a description.
5. Click **Create Pull Request**.

