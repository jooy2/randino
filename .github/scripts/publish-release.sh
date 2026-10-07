#!/usr/bin/env bash
# Creates the GitHub release for the tag being built, or brings it up to date
# when the tag is pushed again after the release already exists, so a re-run
# never fails on its own earlier success.
#
# Usage: publish-release.sh <notes file> [<asset folder>]
#
# Reads GITHUB_REF_NAME, TITLE and VERSION from the environment; gh reads
# GH_TOKEN and GH_REPO. Every file in the asset folder is attached, and a
# version with a pre-release part is marked as one.
set -euo pipefail

notes=$1
assets=()
if [ $# -ge 2 ]; then
  assets=("$2"/*)
fi

if gh release view "$GITHUB_REF_NAME" > /dev/null 2>&1; then
  gh release edit "$GITHUB_REF_NAME" --title "$TITLE" --notes-file "$notes"
  if [ ${#assets[@]} -gt 0 ]; then
    gh release upload "$GITHUB_REF_NAME" "${assets[@]}" --clobber
  fi
else
  prerelease=()
  case "$VERSION" in *-*) prerelease=(--prerelease) ;; esac
  gh release create "$GITHUB_REF_NAME" ${assets[@]+"${assets[@]}"} --verify-tag \
    --title "$TITLE" --notes-file "$notes" ${prerelease[@]+"${prerelease[@]}"}
fi
