import { RepoContext, RepoMetadata } from '../types';

const GITHUB_API_BASE = 'https://api.github.com/repos';

// Helper to parse "user/repo" from URL
export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      return { owner: pathSegments[0], repo: pathSegments[1] };
    }
  } catch (e) {
    // Fallback for non-url string inputs like "owner/repo"
    const parts = url.split('/');
    if (parts.length === 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  }
  return null;
};

// Fetch data from GitHub
export const fetchRepoData = async (owner: string, repo: string): Promise<RepoContext> => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };

  // 1. Fetch Basic Metadata
  const metaRes = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}`, { headers });
  if (!metaRes.ok) throw new Error(`Repository not found or private. Status: ${metaRes.status}`);
  const metaJson = await metaRes.json();

  const metadata: RepoMetadata = {
    name: metaJson.name,
    owner: metaJson.owner.login,
    description: metaJson.description,
    stars: metaJson.stargazers_count,
    forks: metaJson.forks_count,
    language: metaJson.language || 'Unknown',
    openIssues: metaJson.open_issues_count,
    topics: metaJson.topics || [],
    pushedAt: metaJson.pushed_at,
  };

  // 2. Fetch File Structure 
  // Limit to top 100 files to avoid huge payloads which can cause XHR errors
  const treeRes = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}/git/trees/${metaJson.default_branch}?recursive=1`, { headers });
  let fileTree: string[] = [];
  if (treeRes.ok) {
    const treeJson = await treeRes.json();
    fileTree = treeJson.tree.slice(0, 100).map((item: any) => item.path);
  }

  // 3. Fetch README
  let readmeContent = "";
  try {
    const readmeRes = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}/readme`, { headers });
    if (readmeRes.ok) {
      const readmeJson = await readmeRes.json();
      readmeContent = atob(readmeJson.content);
    }
  } catch (e) {
    console.warn("No README found");
  }

  // 4. Fetch Dependency File
  let packageFileContent = "";
  const dependencyFiles = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod', 'composer.json', 'pom.xml', 'build.gradle'];
  
  for (const file of dependencyFiles) {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}/contents/${file}`, { headers });
      if (res.ok) {
        const json = await res.json();
        packageFileContent = `Filename: ${file}\nContent:\n${atob(json.content)}`;
        break;
      }
    } catch (e) {
      continue;
    }
  }

  // 5. Fetch Recent Commits (Limit to 5)
  let recentCommitMessages: string[] = [];
  try {
    const commitsRes = await fetch(`${GITHUB_API_BASE}/${owner}/${repo}/commits?per_page=5`, { headers });
    if (commitsRes.ok) {
      const commitsJson = await commitsRes.json();
      recentCommitMessages = commitsJson.map((c: any) => c.commit.message);
    }
  } catch (e) {
    console.warn("Could not fetch commits");
  }

  return {
    metadata,
    fileTree,
    // Truncate content to avoid token limits and payload size issues
    readmeContent: readmeContent.substring(0, 3000), 
    packageFileContent: packageFileContent.substring(0, 2000),
    recentCommitMessages,
  };
};