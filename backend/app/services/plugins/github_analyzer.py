import requests
import base64

def analyze_github(url):
    parts = url.rstrip('/').split('/')
    if len(parts) < 5:
        return {'error': 'Invalid GitHub URL'}, 0.0
    
    username, repo = parts[-2], parts[-1]
    try:
        # Fetch requirements.txt
        req_url = f'https://api.github.com/repos/{username}/{repo}/contents/requirements.txt'
        headers = {'Accept': 'application/vnd.github.v3+json'}
        response = requests.get(req_url, headers=headers)
        
        score = 0.0
        skills = []
        if response.status_code == 200:
            content = base64.b64decode(response.json()['content']).decode('utf-8')
            skills = [line.strip().split('==')[0] for line in content.split('\n') if line.strip() and '==' in line]
            score += 0.5  # Base score for having a requirements.txt
        
        # Fetch commits
        commits_url = f'https://api.github.com/repos/{username}/{repo}/commits'
        response = requests.get(commits_url, headers=headers)
        if response.status_code == 200:
            commits = response.json()
            score += min(len(commits) * 0.01, 0.5)  # Score based on commit count
        
        return {'url': url, 'skills': skills, 'score': min(score, 1.0)}, score
    except Exception as e:
        return {'error': str(e)}, 0.0