import { useState } from 'react';
import Slider from 'react-slider';

const CustomRange = () => {
  const [value, setValue] = useState([10, 50]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <div className="w-full px-5 py-10 mx-auto">
      <Slider 
        min={0}
        max={100}
        value={value}
        onChange={handleChange}
        pearling
        minDistance={10}
        className="my-slider"
        thumbClassName="thumb"
        trackClassName="track"
        renderTrack={(props, state) => <div {...props} style={{...props.style, backgroundColor: state.index === 1 ? 'green' : 'theme(colors.indigo.200)'}} />}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
      />
      </div>
  );
};

export default CustomRange;
