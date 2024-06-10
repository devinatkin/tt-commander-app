import { extractTTProjects } from '../src/utils/tinytapeout'

test('Get TinyTapeout Run TT04 Projects', async () => {
    const projects = await extractTTProjects("https://tinytapeout.com/runs/tt04/shuttle_index.json");
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt04-factory-test")
    expect(projects).toContain("https://github.com/mattvenn/tt04-vga-clock")
    
});

test('Get TinyTapeout Run TT05 Projects', async () => {
    const projects = await extractTTProjects("https://tinytapeout.com/runs/tt05/shuttle_index.json");
    expect(projects).toContain("https://github.com/TinyTapeout/tt-chip-rom")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-loopback")
    expect(projects).toContain("https://github.com/TinyTapeout/tt05-ringosc-counter")
    expect(projects).toContain("https://github.com/urish/tt05-skullfet")
    
});