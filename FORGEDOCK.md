# ForgeDock Pi Fork

This repository is the ForgeDock-maintained fork of
[`earendil-works/pi`](https://github.com/earendil-works/pi), based on upstream
`v0.83.0` (`845d6ff1f6643aba440341cce877ce1c43ebbc39`). Pi is MIT licensed; the
fork preserves upstream notices and remains MIT licensed.

## Fork boundary

The fork owns the interactive terminal surface:

- ForgeDock application identity and terminal title
- Chrome & Ember startup and first-run branding
- ForgeDock config/session namespace
- release and telemetry behavior appropriate to ForgeDock distribution

ForgeDock workflow authority does **not** move into Pi. The parent ForgeDock
repository injects an extension that delegates `work-on`, `review-pr`, and
`orchestrate` to ForgeDock's typed controller. GitHub artifacts remain durable
authority; Pi sessions remain replaceable execution records.

## Remotes and update policy

- `origin`: `https://github.com/RapierCraftStudios/pi.git`
- `upstream`: `https://github.com/earendil-works/pi.git`
- ForgeDock branch: `forgedock/0.83`

Upstream releases should be merged deliberately. Keep branding changes narrow,
run the coding-agent build and tests, then validate the parent ForgeDock
terminal and controller extension before advancing the submodule pointer.
