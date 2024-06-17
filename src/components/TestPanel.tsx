import { onCleanup, onMount, Show } from 'solid-js';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { TTBoardDevice } from '../ttcontrol/TTBoardDevice';
import { FitAddon } from '@xterm/addon-fit';
import { For } from 'solid-js';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Typography,
} from '@suid/material';

import { shuttle } from '../model/shuttle';

export interface ITestPanelProps {
  device: TTBoardDevice;
}

export function TestPanel(props: ITestPanelProps) {
  let ref: HTMLDivElement | null = null;
  let terminal: Terminal;

  onMount(async () => {
    if (ref) {
      terminal = new Terminal({});
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      // eslint-disable-next-line solid/reactivity
      const { device } = props;

      device.attachTerminal((data) => terminal.write(data));

      terminal.onData((data) => {
        device.terminalWrite(data);
      });

      terminal.open(ref);
      fitAddon.fit();
      terminal.focus();

      onCleanup(() => {
        device.detachTerminal();
      });
    }
  });

  const TestAll = () => {
    console.log('Test All');
    void props.device.sendCommand('tt.shuttle.test_all()');
  };

  const TestProject = (project) => {
    console.log('Macro: ', project.macro);
    console.log('Address: ', project.address);
    console.log('Title: ', project.title);
    console.log('Repo: ', project.repo);
    console.log('Clock Hz: ', project.clock_hz);

    // Send the command tt.shuttle.${project.macro}.test()
    void props.device.sendCommand(`tt.shuttle.${project.macro}.run_test()`);
  };

  return (
    <>
      <Stack direction="row" spacing={1} marginTop={2} marginBottom={2}>
        <Button variant="contained" onClick={TestAll}>
          Test All Shuttle Projects
        </Button>
      </Stack>
      <Typography variant="h6" gutterBottom>
        Select a project to test:
      </Typography>
      <Show when={!shuttle.loading}>
        <List>
          <For each={shuttle.projects}>
            {(project) => (
              <ListItem key={project.address}>
                <ListItemText primary={`${project.title} (${project.address})`} />
                <ListItemSecondaryAction>
                  <Button variant="contained" onClick={() => TestProject(project)}>
                    Test
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            )}
          </For>
        </List>
      </Show>
      <Show when={shuttle.loading}>
        <Typography variant="body1">Loading projects...</Typography>
      </Show>
      <div ref={(el) => (ref = el)} style={{ height: '400px', width: '100%' }} />
    </>
  );
}
