import { extractRepoFromURL } from '../src/utils/github';
import { extractForksFromURL } from '../src/utils/github';

test('Extract Repository from test URL', () => {
    expect(extractRepoFromURL("https://github.com/TinyTapeout/tt-commander-app")).toBe("TinyTapeout/tt-commander-app");
});

test("Extract Forks from TT04 Submission Template from Repository URL", async () => {
    const forks = await extractForksFromURL("https://github.com/TinyTapeout/tt04-submission-template");

    expect(forks).toContain("https://github.com/TinyTapeout/tt04-osu-demo");
    expect(forks).toContain("https://github.com/TinyTapeout/tt-chip-rom");
    expect(forks).toContain("https://github.com/urish/tt04-simon-game")
});