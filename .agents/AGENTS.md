# Workspace Customizations

## GitHub Auto-Push Rule
- Whenever the agent makes successful changes to the codebase and the user's intent is fulfilled, the agent MUST automatically run `git add .`, `git commit -m "..."`, and `git push` to back up the changes to GitHub before concluding the conversation or ending the turn.
- The agent should do this proactively without asking for permission every single time.
