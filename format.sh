echo "reformatting backend"
bash -c "cd backend && uv run uvs format"
echo "reformatting frontend"
bash -c "cd frontend && npm run format"
