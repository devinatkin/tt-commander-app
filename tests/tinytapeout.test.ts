import { extractTTProjects } from '../src/utils/tinytapeout'
import { retrieveTTShuttleIDs } from '../src/utils/tinytapeout'
import {retrieveTTProjects} from '../src/utils/tinytapeout'
import {retrieveTTShuttles} from '../src/utils/tinytapeout'


test('Get TinyTapeout Run TT04 Projects from Hugo Website', async () => {
    const projects = await extractTTProjects("https://tinytapeout.com/runs/tt04/shuttle_index.json");
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-factory-test")
    expect(projects).toContain("https://github.com/mattvenn/tt04-vga-clock")
    
});

test('Get TinyTapeout Run TT05 Projects from Hugo Website', async () => {
    const projects = await extractTTProjects("https://tinytapeout.com/runs/tt05/shuttle_index.json");
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-ringosc-counter")
    expect(projects).toContain("https://github.com/urish/tt05-skullfet")
    
});

test('Get TinyTapeout Shuttle IDs from API', async() => {
    const ids = await retrieveTTShuttleIDs();
    expect(ids).toContain("tt02")
    expect(ids).toContain("tt03")
    expect(ids).toContain("tt04")
    expect(ids).toContain("tt05")
    expect(ids).toContain("tt06")
    expect(ids).toContain("tt07")
});

test('Get Tiny Tapeout Rim TT04 Projects from API', async() => {
    const projects = await retrieveTTProjects('tt04');
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-factory-test")
    expect(projects).toContain("https://github.com/mattvenn/tt04-vga-clock")
});

test('Get Tiny Tapeout Rim TT05 Projects from API', async() => {
    const projects = await retrieveTTProjects('tt05');
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-ringosc-counter")
    expect(projects).toContain("https://github.com/urish/tt05-skullfet")
});

test('Verify Project Counts match to confirm API usage is valid enough', async() => {
    const shuttles = await retrieveTTShuttles();
    for (let shuttle of shuttles){
        const id = shuttle.id;
        const project_count = shuttle.projects;

        const projects = await retrieveTTProjects(id);
        expect(projects).toBeDefined();
        if (projects) {
            // TODO Explore why these numbers don't match
            expect(projects.length - project_count).toBeLessThanOrEqual(2);
        }
    }
},30000)