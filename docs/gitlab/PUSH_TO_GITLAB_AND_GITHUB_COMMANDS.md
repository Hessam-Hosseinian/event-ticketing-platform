# Safe remote publication commands

Inspect before publishing:

```bash
git fetch --all --prune
git status --short --branch
git log --oneline --decorate --graph --max-count=20
git log --left-right --oneline github/main...HEAD
git log --left-right --oneline origin/main...HEAD
```

Push only the current reviewed topic branch:

```bash
git push -u github HEAD
git push -u origin HEAD
```

Open a GitHub PR with `gh pr create --base main --head <branch> ...`. GitLab can create an MR through its UI/CLI
or supported push options, but confirm the returned URL before recording it. Never push main directly, force-push a
protected branch, expose credentials in URLs/commands, or use `git push --all` as routine synchronization.

After merge, fetch both remotes, fast-forward the local main from the authoritative remote and separately synchronize
the lagging mirror through an explicit reviewed MR/fast-forward. Tags are pushed only after archive audit.
