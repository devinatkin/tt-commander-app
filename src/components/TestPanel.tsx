import { onCleanup, onMount } from 'solid-js';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { TTBoardDevice } from '~/ttcontrol/TTBoardDevice';
import { FitAddon } from '@xterm/addon-fit';
import {
  Button,
  Stack,
} from '@suid/material';
import { React } from 'solid-js/web';

export interface ITestPanelProps {
  device: TTBoardDevice;
}

export function TestPanel(props: ITestPanelProps) {
  let ref: HTMLDivElement;
  let terminal: Terminal;

  onMount(async () => {
    terminal = new Terminal({});
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    // eslint-disable-next-line solid/reactivity
    const { device } = props;

    device.attachTerminal((data) => terminal.write(data));

    terminal.onData((data) => {
      device.terminalWrite(data);
    });

    setTimeout(() => {
      terminal.open(ref);
      fitAddon.fit();
      terminal.focus();
    });

    onCleanup(() => {
      device.detachTerminal();
    });
  });

  const TestAll = () => {
    console.log("Test All");
    props.device.sendCommand("tt.shuttle.test_all()");
    
  };

  return (
    <>
      <Stack direction="row" spacing={1} marginTop={2} marginBottom={2}>
        <Button variant="contained" onClick={TestAll}>
          Test Shuttle Projects
        </Button>
      </Stack>
    </>
  );
  
}
