
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

/**
 * Interact with https://index.tinytapeout.com/ to retrieve and return a list of shuttles. (Since TT02)
 * @returns {Promise<string[]|null>}
 */
export async function retrieveTTShuttleIDs(): Promise<string[] | null> {
    const response = await fetch("https://index.tinytapeout.com")
    const data = await response.json();

    const shuttleIDs: string[] = []

    const shuttles = data.shuttles;
    for (let shuttle of shuttles){
        shuttleIDs.push(shuttle.id)
    }
    return shuttleIDs;
}

/** Interact with https://index.tinytapeout.com/ to retrieve and return a list of shuttles plus additional information. (Since TT02)
 *  
 */
export async function retrieveTTShuttles(){
    const response = await fetch("https://index.tinytapeout.com")
    const data = await response.json();
    return data.shuttles;
}

/**
 * Interact with https://index.tinytapeout.com/ to retrieve and return a list of project repos. (Since TT02)
 * 
 */
export async function retrieveTTProjects(id: string): Promise<string[] | null>{
    const url = `https://index.tinytapeout.com/${id}.json`;
    const response = await fetch(url);
    const data = await response.json();

    const repos: string[] = [];

    for (let project of data.projects){
        repos.push(project.repo)
    }
    return repos;
}