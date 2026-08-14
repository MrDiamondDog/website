"use server";

import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

export async function getRepository(owner: string, repo: string) {
    return await octokit.request("GET /repos/{owner}/{repo}", {
        owner,
        repo,
    });
}
