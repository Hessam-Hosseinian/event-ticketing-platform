# Repository and remote notes

| Remote | URL purpose | Current role |
|---|---|---|
| `github` | GitHub repository over HTTPS | latest authoritative main and PR surface |
| `origin` | Chabokan GitLab over SSH | course CI/MR mirror; main may lag GitHub until synchronized |

Hessam uses the verified project identity `Hessam Hosseinian <hessamh2004@gmail.com>` and Pourya uses
`Pourya Fahimi <p.f.challenger369@gmail.com>` for artifacts they actually produce. Local `user.name/email`
may differ, so commits set/verify identity explicitly and `git log --format='%h %an <%ae> %s'` is audited before push.

Always fetch/prune both remotes and compare `main`, `github/main` and `origin/main` before choosing a base. A successful
`git push` does not create or approve a PR unless the remote explicitly confirms it. Avoid blanket `--all` pushes;
push only reviewed branch/tag targets so stale academic branches are not accidentally advertised as current.
