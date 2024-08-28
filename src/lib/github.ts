import { Octokit } from "@octokit/rest";

export const username = "MrDiamondDog";
export const repository = "website-cats";
const mainBranch = "main";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function newBranch(newBranchName: string) {
    const { data: { commit: { sha: latestCommitSha } } } = await octokit.repos.getBranch({
        owner: username,
        repo: repository,
        branch: "main"
    });

    console.log(latestCommitSha);

    return await octokit.git.createRef({
        owner: username,
        repo: repository,
        ref: `refs/heads/${newBranchName}`,
        sha: latestCommitSha,
    });
}

export async function createOrUpdateFile(branch: string, path: string, message: string, content: string, sha?: string) {
    return await octokit.repos.createOrUpdateFileContents({
        owner: username,
        repo: repository,
        path,
        message,
        content,
        branch,
        sha
    });
}

export async function getFileContents(branch: string, path: string) {
    const { data: file } = await octokit.repos.getContent({
        owner: username,
        repo: repository,
        path: path,
        ref: `refs/heads/${branch}`,
    });

    return file;
}

export async function createPullRequest(branch: string, title: string, body: string) {
    await octokit.pulls.create({
        owner: username,
        repo: repository,
        title,
        head: branch,
        base: mainBranch,
        body,
    });
}
