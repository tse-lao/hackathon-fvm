import { ActionButton } from '@/components/application/elements/buttons/ActionButton';
import { useEffect, useState } from 'react';
import Layout from '../Layout';

export default function ExcecuteJob () {
  const [output, setOutput] = useState('');
  const [command, setCommand] = useState('bacalhau docker run ubuntu echo hello');

  useEffect(() => {
    // Fetch data from Express server
    

  }, []);

  const execute = () => {
    fetch(`http://localhost:5001/bacalhau-run?command=${command}`)
      .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        reader.read().then(function processResult(result) {
          if (result.done) return;
          setOutput((prevOutput) => decoder.decode(result.value));
          reader.read().then(processResult);
        });
      })
      .catch(console.error);
    };
  return (
    <Layout>
        <input type="text" onChange={(e) => setCommand(e.target.value)}/>
        <span>{command}</span>
        <ActionButton onClick={execute} text="Execute" />
      <pre>{output}</pre>
    </Layout>
  );
};

