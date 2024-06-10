import { extractRepoFromURL } from '../src/utils/github';

test('extract repository from test URL', () => {
    expect(extractRepoFromURL("https://github.com/TinyTapeout/tt-commander-app")).toBe("TinyTapeout/tt-commander-app");
});
