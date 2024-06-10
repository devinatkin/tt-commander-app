
/**
 * 
 * @param shuttle_index_url - The Tiny Tapeout Run tt04, tt05,
 * @returns {Promise<string[]|null>}
 */
export async function extractTTProjects(shuttle_index_url: string) : Promise<string[] | null> {
    const response = await fetch(shuttle_index_url);
    const data = await response.json();

    const mux = data.mux;

    const projectRepos: string[] = [];
    for (const key in mux) {
        if (mux.hasOwnProperty(key)) {
            const projectRepo = mux[key].repo;
            projectRepos.push(projectRepo);
        }
    }
    return projectRepos;
}