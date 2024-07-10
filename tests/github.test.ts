import { extractRepoFromURL } from '../src/utils/github';
import { extractForksFromURL } from '../src/utils/github';
import { fetchTestCode } from '../src/utils/github';
import { fetchArtifacts } from '../src/utils/github';
import { getLatestArtifact } from '../src/utils/github';

test('Extract Repository from test URL', () => {
  expect(extractRepoFromURL('https://github.com/TinyTapeout/tt-commander-app')).toBe(
    'TinyTapeout/tt-commander-app',
  );
});

test('Extract Forks from TT04 Submission Template from Repository URL', async () => {
  const forks = await extractForksFromURL(
    'https://github.com/TinyTapeout/tt04-submission-template',
  );

  expect(forks).toContain('https://github.com/TinyTapeout/tt04-osu-demo');
  expect(forks).toContain('https://github.com/TinyTapeout/tt-chip-rom');
  expect(forks).toContain('https://github.com/urish/tt04-simon-game');
}, 30000);

test('Test Github Directory Search', async () => {
  const rdir = await fetchTestCode('https://github.com/devinatkin/tt05-stopwatch', '/tb');
  const filePaths = rdir ? rdir.map((file) => file.path) : [];
  expect(filePaths).toContain('tb/timer_tb.sv');
  expect(filePaths).toContain('tb/bcd_binary_tb.sv');
});

test('Fetch Artifacts from GitHub Repository', async () => {
  const artifacts = await fetchArtifacts('https://github.com/devinatkin/tt-micropython-firmware');

  expect(artifacts?.map((artifact) => artifact.name)).toContain('UF2 Artifact');
  expect(artifacts?.map((artifact) => artifact.name)).toContain('Compiled_Test_Artifact');
  expect(artifacts?.map((artifact) => artifact.name)).toContain('Generated_Config_Artifact');
});

test('Latest Artifact Returns Repo', async () => {
  const artifacts = await fetchArtifacts('https://github.com/devinatkin/tt-micropython-firmware');

  expect(artifacts?.map((artifact) => artifact.name)).toContain('UF2 Artifact');
  expect(artifacts?.map((artifact) => artifact.name)).toContain('Compiled_Test_Artifact');
  expect(artifacts?.map((artifact) => artifact.name)).toContain('Generated_Config_Artifact');

  if (artifacts) {
    const latestArtifact = getLatestArtifact(artifacts, 'UF2 Artifact');
    console.log(latestArtifact);
    expect(latestArtifact).toBeDefined();
  }
});
