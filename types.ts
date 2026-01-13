export interface RepoMetadata {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string;
  openIssues: number;
  topics: string[];
  pushedAt: string;
}

export interface FileTreeItem {
  path: string;
  type: 'blob' | 'tree';
}

export interface RepoContext {
  metadata: RepoMetadata;
  fileTree: string[];
  readmeContent: string;
  packageFileContent: string; // package.json, requirements.txt, cargo.toml etc.
  recentCommitMessages: string[];
}

export interface AnalysisResult {
  score: number;
  grade: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  summary: string;
  roadmap: string[];
  breakdown: {
    codeQuality: number;
    documentation: number;
    testing: number;
    structure: number;
    realWorldUtility: number;
  };
  strengths: string[];
  weaknesses: string[];
}
