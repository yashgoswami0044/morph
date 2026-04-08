# Git Setup & Commands Guide 🚀

Here is a simple cheat sheet on how to use standard Git commands to save and upload your code to GitHub.

---

### 1. Check What Changed
Before pushing anything, you can check which files were modified.
```powershell
git status
```

### 2. Save Your Changes (Add)
This tells Git to stage all the files you have changed or added.
```powershell
git add .
```
*(The `.` means "all files in the current folder")*

### 3. Record Your Changes (Commit)
This saves the staged files to your local timeline. Always write a short, descriptive message about what you changed!
```powershell
git commit -m "Updates to UI and added new features"
```

### 4. Upload to GitHub (Push)
This pushes your safely stored local changes up to the GitHub server.
```powershell
git push origin main
```
*(If your master branch is called `master` instead of `main`, use `git push origin master` instead)*

---

### 💡 Combining Them Into One Fast Command (PowerShell)
If you just want to quickly add, commit, and push everything in one go without typing 3 separate lines, use this:

```powershell
git add . ; git commit -m "Your update message here" ; git push origin main
```

### 🔄 Pulling Latest Code (If you changed things on GitHub directly)
If you made changes on GitHub directly (or another computer), you need to pull the newest code down to your computer first before pushing.
```powershell
git pull origin main
```
