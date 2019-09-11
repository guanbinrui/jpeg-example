import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import Picker, { PickerData } from './components/Picker';
import Canvas from './components/Canvas';
import JPEGCanvas from './components/JPEGCanvas';

function App() {
  const [size, setSize] = useState(8);
  const [data, setData] = useState<PickerData>(null);
  const handlePickerChange = useCallback(
    (pickerData: PickerData) => setData(pickerData),
    []
  );

  return (
    <>
      <Picker onChange={handlePickerChange} />

      {data ? (
        <>
          <h2>Original</h2>
          <Canvas
            r={data.r}
            g={data.g}
            b={data.b}
            width={data.width}
            height={data.height}
          />
        </>
      ) : null}
      {data ? (
        <>
          <h2>JPEG</h2>
          <JPEGCanvas
            r={data.r}
            g={data.g}
            b={data.b}
            width={data.width}
            height={data.height}
          />
        </>
      ) : null}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
