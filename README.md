# cs-3365-project

## Installation

```sh
git clone https://github.com/jtman876/cs-3365-project.git
cd cs-3365-project
```

## Making Changes

To start making changes, get the latest changes and start making your own additions.
```sh
# Get latest changes
git checkout master
git pull origin master

# Create a new branch
git checkout -b feature/<your-feature>
```

When you're finished, save your changes.
```sh
git add .
git commit -m "<description of your changes>"
git push origin feature/<your-feature>
```
Once your feature is complete, you can make a pull request to merge your changes with the master branch.
1. Go to the **Pull Requests** tab on GitHub.
2. Click on **New Pull Request**. 
3. Select your branch and compare it to master.
4. Add a description.
5. Click **Create Pull Request**.

## Dependencies
JavaScript libraries are installed via NPM.
- Supabase
- Live Server
- gh-pages

