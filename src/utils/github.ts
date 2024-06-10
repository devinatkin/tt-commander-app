import { Octokit } from "@octokit/rest";

// Import required modules
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Extracts the repository name from a GitHub URL.
 *
 * @param {string} githubUrl - The GitHub URL to extract the repository from.
 * @returns {string|null} The repository name in the format 'owner/repo', or null if the URL is not a GitHub URL or is invalid.
 */
export function extractRepoFromURL(githubUrl: string) {
  try {
    const url = new URL(githubUrl);
    if (url.hostname.toLowerCase() !== 'github.com') {
      return null;
    }

    const pathParts = url.pathname.split('/').slice(1);
    if (pathParts.length < 2) {
      return null;
    }

    return pathParts.slice(0, 2).join('/');
  } catch (err) {
    return null;
  }
}

// Author: Devin Atkin
// Adding the needed github functions here.

/**
 * Returns a list of associated GitHub repositories from a singular repository.
 * @param {string} githubURL - The GitHub URL to extract the forks information from.
 * @returns {Promise<string[]|null>} - The forks information, or null if the URL is not a GitHub URL or is invalid.
 */
export async function extractForksFromURL(githubURL: string): Promise<string[] | null> {
  // Verify the API key exists
  const apiKey = process.env.GH_API_KEY;
  if (!apiKey) {
    throw new Error('GH_API_KEY is not defined in the environment variables.');
  }

  // Extract the repository name
  const repoName = extractRepoFromURL(githubURL);
  if (!repoName) {
    throw new Error('Invalid GitHub URL.');
  }

  // Initialize Octokit
  const octokit = new Octokit({ auth: apiKey });

  try {
    // Fetch the forks information with pagination
    const [owner, repo] = repoName.split('/');
    const forkURLs: string[] = [];

    for await (const response of octokit.paginate.iterator(octokit.rest.repos.listForks, {
      owner,
      repo,
      per_page: 100, // Maximum per page
    })) {
      const urls = response.data.map((fork: { html_url: string }) => fork.html_url);
      forkURLs.push(...urls);
    }

    return forkURLs;
  } catch (error) {
    console.error('Error fetching forks:', error);
    return null;
  }
}
