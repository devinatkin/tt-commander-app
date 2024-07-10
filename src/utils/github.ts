import { Octokit } from '@octokit/rest';

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
  } catch (error: unknown) {
    console.error('Error fetching forks:', error);
    return null;
  }
}

/**
 * Fetches test code from a given GitHub repository.
 *
 * @param {string} repoURL - The URL of the GitHub repository.
 * @param {string} path - The path within the repo to fetch data from.
 * @param {string} branch - The branch to fetch data from.
 * @returns {Promise<string[] | null>} - An array of files in the specified path.
 */
export async function fetchTestCode(repoURL: string, path = '/test/commander', branch = 'main') {
  // Verify the API key exists
  const apiKey = process.env.GH_API_KEY;
  if (!apiKey) {
    throw new Error('GH_API_KEY is not defined in the environment variables.');
  }

  // Initialize Octokit
  const octokit = new Octokit({ auth: apiKey });

  const repository = extractRepoFromURL(repoURL);
  if (!repository) {
    throw new Error('Invalid GitHub URL.');
  }
  const [owner, repo] = repository.split('/');

  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });

    // Check if the returned data is a single file or a directory listing
    if (Array.isArray(data)) {
      // Return the list of file paths in the directory
      return data;
    } else {
      console.error('Path points to a file, not a directory.');
      return null;
    }
  } catch (error: unknown) {
    if (error.status === 404) {
      // As not everyone will implement a test file, this needs to be informational, not an error
      console.info('Not Found');
    } else {
      console.error('Error Retrieving:', error);
    }
    return null;
  }
}

/**
 * Fetches the list of artifacts available for a given GitHub repository.
 *
 * @param {string} repoURL - The URL of the GitHub repository.
 * @returns {Promise<string[] | null>} - An array of artifacts available for the repository.
 */
export async function fetchArtifacts(
  repoURL: string,
  rejectExpired: boolean = false,
): Promise<Array<{ name: string; archive_download_url: string; created_at: string }> | null> {
  // Verify the API key exists
  const apiKey = process.env.GH_API_KEY;
  if (!apiKey) {
    throw new Error('GH_API_KEY is not defined in the environment variables.');
  }

  // Initialize Octokit
  const octokit = new Octokit({ auth: apiKey });

  const repository = extractRepoFromURL(repoURL);
  if (!repository) {
    throw new Error('Invalid GitHub URL.');
  }
  const [owner, repo] = repository.split('/');

  try {
    const { data } = await octokit.actions.listArtifactsForRepo({
      owner,
      repo,
    });

    const artifacts = data.artifacts
      .filter((artifact: { expired: boolean }) => !rejectExpired || !artifact.expired)
      .map(
        (artifact: { name: string; archive_download_url: string; created_at: string | null }) => ({
          name: artifact.name,
          archive_download_url: artifact.archive_download_url,
          created_at: artifact.created_at ?? '',
        }),
      );

    return artifacts;
  } catch (error: unknown) {
    console.error('Error fetching artifacts:', error);
    return null;
  }
}

/**
 * Returns the latest artifact with a specific name from the given array of artifacts.
 *
 * @param {Array<{ name: string, archive_download_url: string, created_at: string }>} artifacts - The array of artifacts.
 * @param {string} name - The name of the artifact to search for.
 * @returns {string|null} - The download URL of the latest artifact with the specified name, or null if not found.
 */
export function getLatestArtifact(
  artifacts: Array<{ name: string; archive_download_url: string; created_at: string }>,
  name: string,
): string | null {
  // Filter the artifacts by name
  const filteredArtifacts = artifacts.filter((artifact) => artifact.name === name);

  // Sort the filtered artifacts by creation date in descending order
  const sortedArtifacts = filteredArtifacts.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  // Return the download URL of the latest artifact, if found
  if (sortedArtifacts.length > 0) {
    return sortedArtifacts[0].archive_download_url;
  } else {
    return null;
  }
}
